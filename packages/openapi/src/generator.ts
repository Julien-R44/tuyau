import { defu } from 'defu'
import type tsMorph from 'ts-morph'
import YAML from 'json-to-pretty-yaml'
import type { OpenAPIV3_1 } from 'openapi-types'
import type { TuyauConfig } from '@tuyau/core/types'

import { objectMap, uniqBy } from './utils.js'
import { typeFootprint } from './footprint.js'
import type { MetaStore } from './meta_store.js'

export class OpenApiGenerator {
  constructor(
    private config: TuyauConfig,
    private metaStore: MetaStore,
    private tsConfigFilePath: string,
  ) {}

  #typeToOpenApiType(type: tsMorph.Type<tsMorph.ts.Type>, mode: 'request' | 'response') {
    if (type.getText() === 'true' || type.getText() === 'false') return 'boolean'

    if (type.isString()) return 'string'
    if (type.isNumber()) return 'number'
    if (type.isBoolean()) return 'boolean'
    if (type.isLiteral()) return 'string'
    if (type.isBooleanLiteral()) return 'boolean'

    if (type.isArray()) {
      return {
        type: 'array',
        items: {
          type: 'object',
          properties: this.#typeToOpenApiSchema({ type: type.getArrayElementTypeOrThrow(), mode }),
        },
      }
    }

    return 'object'
  }

  /**
   * Check if the type is a primitive type
   */
  #isPrimitive(type: tsMorph.Type<tsMorph.ts.Type>) {
    return (
      type.isString() ||
      type.isNumber() ||
      type.isBoolean() ||
      type.isEnum() ||
      type.isLiteral() ||
      type.isUndefined() ||
      type.isNull() ||
      type.isBooleanLiteral()
    )
  }

  /**
   * Convert a `request` or `response` type to openapi properties
   */
  #typeToOpenApiSchema(options: {
    type: tsMorph.Type<tsMorph.ts.Type>
    mode: 'request' | 'response'
    addRequiredKey?: boolean
  }) {
    const { type, mode, addRequiredKey = true } = options
    const properties: Record<string, any> = {}

    for (const prop of type.getProperties()) {
      const propName = prop.getName()
      const type = prop.getValueDeclaration()?.getType()
      if (!type) continue

      /**
       * Array
       */
      if (type.isArray()) {
        properties[propName] = {
          type: 'array',
          items: {
            type: this.#typeToOpenApiType(type.getArrayElementTypeOrThrow(), mode),
            properties: this.#typeToOpenApiSchema({
              ...options,
              type: type.getArrayElementTypeOrThrow(),
            }),
          },
        }
        continue
      }

      /**
       * Union of primitives
       */
      const isUnionOfPrimitives =
        type.isUnion() && type.getUnionTypes().every(this.#isPrimitive.bind(this))

      if (isUnionOfPrimitives) {
        const possiblesTypes = type
          .getUnionTypes()
          .filter((t) => {
            if (mode === 'request') return !t.isUndefined() && !t.isNull()
            return true
          })
          .map((t) => ({ type: this.#typeToOpenApiType(t, mode) }))

        properties[propName] = {
          ...(addRequiredKey ? { required: !type.isUndefined() && !type.isNull() } : {}),
          oneOf: uniqBy(possiblesTypes, (t) => t.type),
        }
        continue
      }

      /**
       * Primitive
       */
      const isPrimitive = this.#isPrimitive(type)
      if (isPrimitive) {
        properties[propName] = {
          ...(addRequiredKey ? { required: !type.isUndefined() && !type.isNull() } : {}),
          type: type.isLiteral() ? 'string' : type.getText(),
        }
        continue
      }

      /**
       * Finally, if the type is an object, then recursively
       * generate the properties for it
       */
      properties[propName] = {
        type: 'object',
        properties: this.#typeToOpenApiSchema({ type, mode, addRequiredKey }),
      }
    }

    return properties
  }

  #requestToOpenApi(method: string, request: any) {
    /**
     * When method is `get` `head` or `delete`, we need to define the request as
     * query parameters
     */
    if (method === 'get' || method === 'head' || method === 'delete') {
      return {
        parameters: Object.entries(request).map(([name, type]: any) => {
          return {
            name,
            in: 'query',
            schema: { type: 'object', ...type },
          }
        }),
      }
    }

    /**
     * Otherwise, define the request as a request body
     */
    return {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: objectMap(request, (key, value: any) => {
                const { required, ...type } = value
                return [key, { ...type }]
              }),
              required: Object.entries(request)
                .filter(([, type]: any) => type.required)
                .map(([name]) => name),
            },
          },
        },
      },
    }
  }

  #generateEndpointSpec(options: {
    path: string
    method: 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete'
    type: tsMorph.Type<tsMorph.ts.ObjectType>
  }) {
    const method = options.method
    if (method === 'head') return

    const methodSymbol = options.type.getProperty(`$${method}`)
    if (!methodSymbol) return

    const methodType = methodSymbol.getValueDeclaration()?.getType()
    const requestType = methodType?.getProperty('request')
    const responseType = methodType?.getProperty('response')

    const requestDefinition = requestType?.getValueDeclarationOrThrow().getType()
    const responseDefinition = responseType?.getValueDeclarationOrThrow().getType()

    const request = this.#typeToOpenApiSchema({ type: requestDefinition!, mode: 'request' })
    const responses = this.#typeToOpenApiSchema({
      type: responseDefinition!,
      mode: 'response',
      addRequiredKey: false,
    })

    const { openApiPath, openApiParameters } = this.#pathToOpenApiPathAndParameters(options.path)

    const parameters = defu(
      { parameters: openApiParameters },
      this.#requestToOpenApi(method, request),
    )

    return {
      method,
      path: openApiPath,
      spec: defu(this.metaStore.getComputed({ method, path: options.path }), {
        ...parameters,
        responses: objectMap(responses, (status, schema) => {
          return [
            status,
            {
              description: status === '200' ? 'Successful response' : 'Error response',
              content: { 'application/json': { schema } },
            },
          ]
        }),
      }),
    }
  }

  /**
   * Given a path like `/users/:id`, it returns :
   * - openApiPath: `/users/{id}`
   * - and parameters to be passed to the openapi spec
   */
  #pathToOpenApiPathAndParameters(path: string) {
    const parameters = path.match(/:(\w+)/g) || []
    const openApiPath = path.replace(/:(\w+)/g, '{$1}')

    const openApiParameters = parameters.map((param) => ({
      name: param.replace(':', ''),
      in: 'path',
      required: true,
      schema: { type: 'string' },
    }))

    return { openApiPath, parameters, openApiParameters }
  }

  /**
   * Check if the given path is excluded. Excluded path are defined
   * inside the config/tuyau.ts file
   */
  #isPathExcluded(path: string) {
    for (const ignoreRoute of this.config.openapi?.exclude || []) {
      if (typeof ignoreRoute === 'string' && ignoreRoute === path) {
        return true
      }

      if (ignoreRoute instanceof RegExp && ignoreRoute.test(path)) {
        return true
      }
    }

    return false
  }

  #generateApiDoc(options: {
    prefix?: string
    definition: tsMorph.InterfaceDeclaration
    openApiDoc: OpenAPIV3_1.Document
  }) {
    const { prefix = '', definition, openApiDoc } = options
    const methods = ['$get', '$head', '$post', '$put', '$patch', '$delete'] as const

    /**
     * Loop over all properties and look for endpoints definitions
     */
    for (const prop of definition.getProperties()) {
      const type = prop.getType()
      const properties = type.getProperties()
      const name = prop.getName().replace(/'/g, '')

      /**
       * If the property is an endpoint definition, then check for
       * every method existence and generate the openapi spec for it
       */
      const isEndpoint = type.isObject() && properties.some((p) => p.getName() === '$url')
      if (isEndpoint) {
        for (const method of methods) {
          if (this.#isPathExcluded(`${prefix}/${name}`)) continue

          const doc = this.#generateEndpointSpec({
            path: `${prefix}/${name}`,
            method: method.replace('$', '') as any,
            type,
          })

          if (!doc) continue

          openApiDoc.paths = openApiDoc.paths || {}
          openApiDoc.paths[doc.path] = openApiDoc.paths[doc.path] || {}
          // @ts-expect-error tkt
          openApiDoc.paths[doc.path][doc.method] = doc.spec
        }
      }

      /**
       * If the property has nested elements, then recursively
       * generate the openapi spec for it
       */
      const hasNestedElements = properties.some(
        (p) => p.getName() !== '$url' && !methods.includes(p.getName() as any),
      )
      if (hasNestedElements && !methods.includes(name as any)) {
        this.#generateApiDoc({
          definition: type.getSymbolOrThrow().getDeclarations()[0] as tsMorph.InterfaceDeclaration,
          prefix: `${prefix}/${name}`,
          openApiDoc,
        })
      }
    }
  }

  /**
   * Generate the openapi documentation from the typescript api definition
   */
  async generate() {
    const { Project, QuoteKind } = await import('ts-morph')

    const project = new Project({
      manipulationSettings: { quoteKind: QuoteKind.Single },
      tsConfigFilePath: this.tsConfigFilePath,
    })

    const footprint = typeFootprint('.adonisjs/api.ts', 'ApiDefinition', {
      tsConfigFilePath: this.tsConfigFilePath,
    })

    const footprintFile = project.createSourceFile('.adonisjs/__footprint.ts', footprint, {
      overwrite: true,
    })

    const definition = footprintFile.getInterfaceOrThrow('ApiDefinition')

    const openApiDoc: OpenAPIV3_1.Document = defu(this.config.openapi?.documentation, {
      openapi: '3.1.0',
      info: { title: 'AdonisJS API', version: '1.0.0' },
      servers: [{ url: 'http://localhost:3333' }],
      paths: {},
    })

    this.#generateApiDoc({ definition, openApiDoc })

    return YAML.stringify(openApiDoc)
  }
}
