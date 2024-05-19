import { defu } from 'defu'
import type tsMorph from 'ts-morph'
import YAML from 'json-to-pretty-yaml'
import type { OpenAPIV3_1 } from 'openapi-types'
import type { TuyauConfig } from '@tuyau/core/types'

import { objectMap } from './utils.js'
import { typeFootprint } from './footprint.js'
import type { MetaStore } from './meta_store.js'

export class OpenApiGenerator {
  constructor(
    private config: TuyauConfig,
    private metaStore: MetaStore,
    private tsConfigFilePath: string,
  ) {}

  #typeToOpenApiType(type: tsMorph.Type<tsMorph.ts.Type>) {
    if (type.isString()) return 'string'
    if (type.isNumber()) return 'number'
    if (type.isBoolean()) return 'boolean'
    if (type.isLiteral()) return 'string'

    if (type.isArray()) {
      return {
        type: 'array',
        items: {
          type: 'object',
          properties: this.#typeToOpenApiProperties(type.getArrayElementTypeOrThrow()),
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
      type.isString() || type.isNumber() || type.isBoolean() || type.isEnum() || type.isLiteral()
    )
  }

  /**
   * Check if the type is an optional primitive type
   */
  #isOptionalPrimitive(type: tsMorph.Type<tsMorph.ts.Type>) {
    if (!type.isUnion()) {
      return false
    }

    const unionTypes = type.getUnionTypes()
    return unionTypes.some((t) => t.isUndefined()) && unionTypes.some((t) => this.#isPrimitive(t))
  }

  /**
   * Extract the main type from an optional union type
   */
  #extractTypeFromOptionalUnion(type: tsMorph.Type<tsMorph.ts.Type>) {
    if (!type.isUnion()) return type

    return type.getUnionTypes().find((t) => !t.isUndefined())!
  }

  /**
   * Convert a `request` or `response` type to openapi properties
   */
  #typeToOpenApiProperties(type: tsMorph.Type<tsMorph.ts.Type>) {
    const properties: Record<string, any> = {}

    for (const prop of type.getProperties()) {
      const type = prop.getValueDeclaration()?.getType()
      if (!type) continue

      if (type.isArray()) {
        properties[prop.getName()] = {
          type: 'array',
          items: {
            type: this.#typeToOpenApiType(type.getArrayElementTypeOrThrow()),
            properties: this.#typeToOpenApiProperties(type.getArrayElementTypeOrThrow()),
          },
        }
        continue
      }

      const isPrimitive = this.#isPrimitive(type)
      const isOptionalPrimitive = this.#isOptionalPrimitive(type)
      const isLiteral = type.isLiteral()

      let specType = 'object'
      if (isPrimitive) {
        specType = isLiteral ? 'string' : type.getText()
      } else if (isOptionalPrimitive) {
        specType = this.#extractTypeFromOptionalUnion(type).getText()
      }

      properties[prop.getName()] = {
        type: specType,
        required: isOptionalPrimitive ? false : true,
        properties: isPrimitive ? undefined : this.#typeToOpenApiProperties(type),
      }
    }

    return properties
  }

  #requestToOpenApi(method: string, request: any) {
    /**
     * When method is `get` or `head`, we need to define the request as
     * query parameters
     */
    if (method === 'get' || method === 'head') {
      return {
        parameters: Object.entries(request).map(([name, type]: any) => {
          return {
            name,
            in: 'query',
            ...(type.required ? { required: true } : {}),
            schema: { type: type.type },
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
              properties: request,
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

    const request = this.#typeToOpenApiProperties(requestDefinition!)
    const responses = this.#typeToOpenApiProperties(responseDefinition!)

    const { openApiPath, openApiParameters } = this.#pathToOpenApiPathAndParameters(options.path)

    const parameters = defu(
      { parameters: openApiParameters },
      this.#requestToOpenApi(method, request),
    )

    return {
      method,
      path: openApiPath,
      spec: {
        ...this.metaStore.getComputed(options.path),
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
      },
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
