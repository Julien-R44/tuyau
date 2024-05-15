import { defu } from 'defu'
import type tsMorph from 'ts-morph'
import YAML from 'json-to-pretty-yaml'
import type { OpenAPIV3_1 } from 'openapi-types'
import type { TuyauConfig } from '@tuyau/core/types'

import type { MetaStore } from '../providers/openapi_provider.js'

// import { typeFootprint } from './footprint.js'

interface DefinitionRequestResponse {
  request: string
  responses: {
    [status: number]: {
      type: string
      properties: Record<string, any>
    }
  }
}

interface FlattenDefinition {
  [path: string]: {
    $get?: DefinitionRequestResponse
    $head?: DefinitionRequestResponse
    $post?: DefinitionRequestResponse
    $put?: DefinitionRequestResponse
    $patch?: DefinitionRequestResponse
    $delete?: DefinitionRequestResponse
  }
}

export class OpenApiGenerator {
  constructor(
    private apiDefinition: tsMorph.InterfaceDeclaration,
    private config: TuyauConfig,
    private metaStore: MetaStore,
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

  #isPrimitive(type: tsMorph.Type<tsMorph.ts.Type>) {
    return (
      type.isString() || type.isNumber() || type.isBoolean() || type.isEnum() || type.isLiteral()
    )
  }

  #isOptionalPrimitive(type: tsMorph.Type<tsMorph.ts.Type>) {
    if (!type.isUnion()) {
      return false
    }

    const unionTypes = type.getUnionTypes()
    return unionTypes.some((t) => t.isUndefined()) && unionTypes.some((t) => this.#isPrimitive(t))
  }

  #extractTypeFromOptionalUnion(type: tsMorph.Type<tsMorph.ts.Type>) {
    if (!type.isUnion()) return type

    return type.getUnionTypes().find((t) => !t.isUndefined())!
  }

  #typeToOpenApiProperties(type: tsMorph.Type<tsMorph.ts.Type>) {
    const properties: Record<string, any> = {}

    for (const prop of type.getProperties()) {
      const propType = prop.getValueDeclaration()?.getType()!

      if (!propType) {
        continue
      }

      if (propType.isArray()) {
        properties[prop.getName()] = {
          type: 'array',
          items: {
            type: this.#typeToOpenApiType(propType.getArrayElementTypeOrThrow()),
            properties: this.#typeToOpenApiProperties(propType.getArrayElementTypeOrThrow()),
          },
        }
        continue
      }

      const isPrimitive = this.#isPrimitive(propType)
      const isOptionalPrimitive = this.#isOptionalPrimitive(propType)
      const isLiteral = propType.isLiteral()

      let type = 'object'
      if (isPrimitive) {
        type = isLiteral ? 'string' : propType.getText()
      } else if (isOptionalPrimitive) {
        type = this.#extractTypeFromOptionalUnion(propType).getText()
      }

      properties[prop.getName()] = {
        type,
        required: isOptionalPrimitive ? false : true,
        properties: isPrimitive ? undefined : this.#typeToOpenApiProperties(propType),
      }
    }

    return properties
  }

  #flattenInterface(
    definition: tsMorph.InterfaceDeclaration,
    prefix = '',
    result: Record<string, any> = {},
  ) {
    const methods = ['$get', '$head', '$post', '$put', '$patch', '$delete']
    for (const prop of definition.getProperties()) {
      const type = prop.getType()
      const properties = type.getProperties()
      const isEndpoint = type.isObject() && properties.some((p) => p.getName() === '$url')
      const hasChild = properties.some(
        (p) => p.getName() !== '$url' && methods.includes(p.getName()),
      )

      const childElements = properties.filter(
        (p) => p.getName() !== '$url' && !methods.includes(p.getName()),
      )

      if (isEndpoint) {
        const name = prop.getName().replace(/'/g, '')
        for (const method of methods) {
          const methodSymbol = type.getProperty(method)
          if (methodSymbol) {
            const methodType = methodSymbol.getValueDeclaration()?.getType()
            const requestType = methodType?.getProperty('request')
            const responseType = methodType?.getProperty('response')

            const requestDefinition = requestType?.getValueDeclarationOrThrow().getType()
            const responseDefinition = responseType?.getValueDeclarationOrThrow().getType()

            result[`${prefix}/${name}`] = {
              ...result[`${prefix}/${name}`],
              [method]: {
                request: this.#typeToOpenApiProperties(requestDefinition!),
                // response: responseDefinition?.getText(),
                responses: this.#typeToOpenApiProperties(responseDefinition!),
              },
            }
          }
        }

        console.log('Endpoint:', prop.getName(), 'hasChild:', hasChild)
        const isNotUrlOrMethods = prop.getName() !== '$url' && !methods.includes(prop.getName())
        if (hasChild && isNotUrlOrMethods && childElements.length > 0) {
          result = this.#flattenInterface(
            type.getSymbolOrThrow().getDeclarations()[0] as tsMorph.InterfaceDeclaration,
            `${prefix}/${name}`,
            result,
          )
        }
      }
    }

    return result
  }

  #requestToOpenApi(method: string, request: any) {
    if (method === 'get' || method === 'head') {
      return {
        parameters: Object.entries(request).map(([name, type]) => {
          return {
            name,
            in: 'query',
            ...(type.required ? { required: true } : {}),
            schema: { type: type.type },
          }
        }),
      }
    }

    return {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: request,
              required: Object.entries(request)
                .filter(([, type]) => type.required)
                .map(([name]) => {
                  return name
                }),
            },
          },
        },
      },
    }
  }

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

  async generate() {
    const result: FlattenDefinition = this.#flattenInterface(this.apiDefinition)

    const openApi: OpenAPIV3_1.Document = defu(this.config.openapi?.documentation, {
      openapi: '3.1.0',
      info: { title: 'AdonisJS API', version: '1.0.0' },
      servers: [{ url: 'http://localhost:3333' }],
      paths: {},
    })

    for (const [path, methods] of Object.entries(result)) {
      // replace params format like `:id` to `{id}`
      const { openApiPath, openApiParameters } = this.#pathToOpenApiPathAndParameters(path)

      openApi.paths[openApiPath] = {}

      for (let [method, { request, responses }] of Object.entries(methods)) {
        method = method.replace('$', '') as 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete'
        if (method === 'head') continue

        const parameters = defu(
          { parameters: openApiParameters },
          this.#requestToOpenApi(method, request),
        )

        openApi.paths[openApiPath][method] = {
          ...this.metaStore.get(path),
          ...parameters,
          responses: Object.fromEntries(
            Object.entries(responses).map(([status, schema]) => {
              return [
                status,
                {
                  description: status === '200' ? 'Successful response' : 'Error response',
                  content: { 'application/json': { schema } },
                },
              ]
            }),
          ),
        }
      }
    }

    return YAML.stringify(openApi)
  }
}
