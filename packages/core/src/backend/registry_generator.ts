import { dirname } from 'node:path'
import { writeFile, mkdir } from 'node:fs/promises'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { ScannedRoute, RoutesListItem } from '@adonisjs/assembler/types'
import { GenerateRegistryConfig } from './types.ts'
import type { CompactRouteToken } from '../client/types/types.ts'

const DEFAULT_VALIDATION_ERROR_TYPE = '{ errors: SimpleError[] }'

/**
 * Pure generation logic for tuyau registry files.
 * All public methods are pure (return strings, no I/O) except `writeOutput`.
 */
export class RegistryGenerator {
  #validationErrorType: string | false
  #typeAugmentation: boolean
  #routesFilter?: GenerateRegistryConfig['routes']

  constructor(
    options?: Pick<GenerateRegistryConfig, 'validationErrorType' | 'typeAugmentation' | 'routes'>,
  ) {
    this.#validationErrorType =
      options?.validationErrorType === undefined
        ? DEFAULT_VALIDATION_ERROR_TYPE
        : options.validationErrorType
    this.#typeAugmentation = options?.typeAugmentation ?? true
    this.#routesFilter = options?.routes
  }

  /**
   * Test a route name against a string, regex, or function pattern.
   */
  #matchesPattern(
    routeName: string,
    pattern: string | RegExp | ((routeName: string) => boolean),
  ): boolean {
    if (typeof pattern === 'string') return routeName.includes(pattern)
    if (pattern instanceof RegExp) {
      const lastIndex = pattern.lastIndex
      pattern.lastIndex = 0
      const matches = pattern.test(routeName)
      pattern.lastIndex = lastIndex
      return matches
    }
    if (typeof pattern === 'function') return pattern(routeName)

    return false
  }

  /**
   * Check if a route passes the configured only/except filters.
   * Returns true when no filters are set.
   */
  filterRoute(route: Pick<RoutesListItem, 'name'>): boolean {
    if (!this.#routesFilter) return true

    const { only, except } = this.#routesFilter

    if (only && except)
      throw new Error('Cannot use both "only" and "except" filters at the same time')

    if (only) return only.some((pattern) => this.#matchesPattern(route.name!, pattern))
    if (except) return !except.some((pattern) => this.#matchesPattern(route.name!, pattern))

    return true
  }

  /**
   * Convert `import('app/...')` paths to `import('#app/...')` subpath
   * imports and strip `.ts` extensions.
   */
  #normalizeImportPaths(typeString: string): string {
    return typeString.replace(/import\('app\//g, "import('#app/").replace(/\.ts'\)/g, "')")
  }

  /**
   * Encode client tokens as tuples, omitting empty suffixes and server-only fields.
   */
  #sanitizeTokens(tokens: ScannedRoute['tokens']): CompactRouteToken[] {
    return tokens.map(({ type, val, end }) => (end === '' ? [type, val] : [type, val, end]))
  }

  /**
   * Extract dynamic params from route tokens and return
   * the TS type string and tuple representation.
   */
  #generateRouteParams(route: ScannedRoute) {
    const dynamicParams = route.tokens.filter((token) => token.type === 1 || token.type === 2)
    const paramsType = dynamicParams
      .map((token) => {
        if (token.type === 2) return "'*': ParamValue[]"
        return `${token.val}: ParamValue`
      })
      .join('; ')
    const paramsTuple = dynamicParams.map(() => 'ParamValue').join(', ')

    return { paramsType, paramsTuple }
  }

  /**
   * Wrap a response type with `ExtractResponse` (and `Awaited`
   * for `ReturnType<>`) to extract the `__response` property.
   */
  #wrapResponseType(responseType: string): string {
    if (responseType === 'unknown' || responseType === '{}') return responseType
    if (responseType.startsWith('ReturnType<')) return `ExtractResponse<Awaited<${responseType}>>`

    return `ExtractResponse<${responseType}>`
  }

  /**
   * Wrap a response type with `ExtractErrorResponse` to
   * extract non-2xx error types from the response union.
   */
  #wrapErrorResponseType(responseType: string): string {
    if (responseType === 'unknown' || responseType === '{}') return 'unknown'
    if (responseType.startsWith('ReturnType<'))
      return `ExtractErrorResponse<Awaited<${responseType}>>`

    return `ExtractErrorResponse<${responseType}>`
  }

  /**
   * Wrap a response type with `ExtractRawResponse` to expose the full
   * `{ status; response }` discriminated union across all status codes
   * (success + error). Consumed by OpenAPI generators.
   */
  #wrapRawResponseType(responseType: string): string {
    if (responseType.startsWith('ReturnType<'))
      return `ExtractRawResponse<Awaited<${responseType}>>`

    return `ExtractRawResponse<${responseType}>`
  }

  /**
   * Resolve body and query type strings based on the HTTP method.
   * GET/HEAD routes use `ExtractQueryForGet`, others use
   * `ExtractBody`/`ExtractQuery`.
   */
  #determineBodyAndQueryTypes(options: { methods: string[]; requestType: string }) {
    const { methods, requestType } = options
    const primaryMethod = methods[0]
    const isGetLike = primaryMethod === 'GET' || primaryMethod === 'HEAD'
    const hasValidator = requestType !== '{}'

    if (!hasValidator) return { bodyType: '{}', queryType: '{}' }

    if (isGetLike) return { bodyType: '{}', queryType: `ExtractQueryForGet<${requestType}>` }

    return {
      bodyType: `ExtractBody<${requestType}>`,
      queryType: `ExtractQuery<${requestType}>`,
    }
  }

  /**
   * Build a nested Map from dot-separated route names.
   * Uses `$self` to handle nodes that are both a leaf and a prefix.
   */
  #buildTreeStructure(routes: ScannedRoute[]): Map<string, any> {
    const tree = new Map<string, any>()

    for (const route of routes) {
      const segments = route.name.split('.')
      let current = tree

      for (let i = 0; i < segments.length; i++) {
        const segment = stringHelpers.camelCase(segments[i])
        const isLast = i === segments.length - 1

        if (isLast) {
          if (current.has(segment) && current.get(segment) instanceof Map) {
            current.get(segment).set('$self', { routeName: route.name, route })
          } else {
            current.set(segment, { routeName: route.name, route })
          }
        } else {
          if (!current.has(segment)) {
            current.set(segment, new Map<string, any>())
          } else {
            const existing = current.get(segment)
            if (!(existing instanceof Map)) {
              const newMap = new Map<string, any>()
              newMap.set('$self', existing)
              current.set(segment, newMap)
            }
          }
          current = current.get(segment)
        }
      }
    }

    return tree
  }

  /**
   * Recursively emit TS interface lines from the nested tree Map.
   * Nodes with `$self` produce intersection types.
   */
  #generateTreeInterface(tree: Map<string, any>, indent: number = 2): string {
    const spaces = ' '.repeat(indent)
    const lines: string[] = []

    for (const [key, value] of tree) {
      if (key === '$self') continue

      if (value instanceof Map) {
        const selfRoute = value.get('$self')
        if (selfRoute) {
          lines.push(`${spaces}${key}: typeof routes['${selfRoute.routeName}'] & {`)
          lines.push(this.#generateTreeInterface(value, indent + 2))
          lines.push(`${spaces}}`)
        } else {
          lines.push(`${spaces}${key}: {`)
          lines.push(this.#generateTreeInterface(value, indent + 2))
          lines.push(`${spaces}}`)
        }
      } else {
        lines.push(`${spaces}${key}: typeof routes['${value.routeName}']`)
      }
    }

    return lines.join('\n')
  }

  /**
   * Generate a single runtime registry entry for a route
   * (methods, pattern, tokens, and a typed placeholder).
   */
  generateRuntimeRegistryEntry(route: ScannedRoute): string {
    const routeName = route.name
    const sanitizedTokens = this.#sanitizeTokens(route.tokens)

    return `  '${routeName}': {
    methods: ${JSON.stringify(route.methods)},
    pattern: '${route.pattern}',
    tokens: ${JSON.stringify(sanitizedTokens)},
    types: placeholder as Registry['${routeName}']['types'],
  }`
  }

  /**
   * Generate a single type-level registry entry for a route
   * (body, query, params, response, and error response types).
   */
  generateTypesRegistryEntry(route: ScannedRoute): string {
    const requestType = this.#normalizeImportPaths(route.request?.type || '{}')
    const rawResponseType = route.response?.type || 'unknown'
    const responseType = this.#wrapResponseType(rawResponseType)
    const hasValidator = requestType !== '{}'

    let errorResponseType = this.#wrapErrorResponseType(rawResponseType)
    let rawResponseUnion = this.#wrapRawResponseType(rawResponseType)

    if (hasValidator && this.#validationErrorType !== false) {
      const validationError = `{ status: 422; response: ${this.#validationErrorType} }`
      errorResponseType =
        errorResponseType === 'unknown'
          ? validationError
          : `${errorResponseType} | ${validationError}`
      rawResponseUnion = `${rawResponseUnion} | ${validationError}`
    }

    const { paramsType, paramsTuple } = this.#generateRouteParams(route)
    const routeName = route.name

    const { bodyType, queryType } = this.#determineBodyAndQueryTypes({
      methods: route.methods,
      requestType,
    })

    return `  '${routeName}': {
    methods: ${JSON.stringify(route.methods)}
    pattern: '${route.pattern}'
    types: {
      body: ${bodyType}
      paramsTuple: [${paramsTuple}]
      params: ${paramsType ? `{ ${paramsType} }` : '{}'}
      query: ${queryType}
      response: ${responseType}
      errorResponse: ${errorResponseType}
      rawResponse: ${rawResponseUnion}
    }
  }`
  }

  /**
   * Generate the full runtime registry file (`index.ts`)
   * with route definitions and module augmentation.
   */
  generateRuntimeContent(routes: ScannedRoute[]): string {
    const registryEntries = routes
      .map((route) => this.generateRuntimeRegistryEntry(route))
      .join(',\n')
    const moduleAugmentation = this.#typeAugmentation
      ? `
declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
`
      : ''

    return `/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

export type { Route, Path } from './schema.d.ts'

const placeholder: any = {}

const routes = {
${registryEntries},
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}
${moduleAugmentation}`
  }

  /**
   * Generate the types-only registry file (`schema.d.ts`)
   * with request/response type definitions for each route.
   */
  generateTypesContent(routes: ScannedRoute[]): string {
    const registryEntries = routes.map((route) => this.generateTypesRegistryEntry(route)).join('\n')

    const useDefaultValidationType = this.#validationErrorType === DEFAULT_VALIDATION_ERROR_TYPE
    const coreImports = [
      'ExtractBody',
      'ExtractErrorResponse',
      'ExtractQuery',
      'ExtractQueryForGet',
      'ExtractRawResponse',
      'ExtractResponse',
      'Method',
      'PathWithRegistry',
      'PatternsByMethod',
      'RouteWithRegistry',
    ]
    const vineImports = ['InferInput']
    if (useDefaultValidationType) vineImports.push('SimpleError')

    return `/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ${coreImports.join(', ')} } from '@tuyau/core/types'
import type { ${vineImports.join(', ')} } from '@vinejs/vine/types'
import type { routes } from './index.ts'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
${registryEntries}
}

export namespace Route {
  export type Request<Name extends keyof typeof routes> = RouteWithRegistry.Request<typeof routes, Name>
  export type Response<Name extends keyof typeof routes> = RouteWithRegistry.Response<typeof routes, Name>
  export type Params<Name extends keyof typeof routes> = RouteWithRegistry.Params<typeof routes, Name>
  export type Body<Name extends keyof typeof routes> = RouteWithRegistry.Body<typeof routes, Name>
  export type Query<Name extends keyof typeof routes> = RouteWithRegistry.Query<typeof routes, Name>
  export type Error<Name extends keyof typeof routes> = RouteWithRegistry.Error<typeof routes, Name>
}

export namespace Path {
  export type Request<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Request<typeof routes, M, P>
  export type Response<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Response<typeof routes, M, P>
  export type Params<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Params<typeof routes, M, P>
  export type Body<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Body<typeof routes, M, P>
  export type Query<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Query<typeof routes, M, P>
  export type Error<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Error<typeof routes, M, P>
}
`
  }

  /**
   * Generate the tree types file (`tree.d.ts`) with a nested
   * interface mirroring the dot-separated route name hierarchy.
   */
  generateTreeContent(routes: ScannedRoute[]): string {
    const tree = this.#buildTreeStructure(routes)
    const treeInterface = this.#generateTreeInterface(tree)

    return `/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
${treeInterface}
}
`
  }

  /**
   * Write a file to disk, creating parent directories if needed.
   */
  async #writeFile(filePath: string, content: string) {
    const dir = dirname(filePath)
    await mkdir(dir, { recursive: true })
    await writeFile(filePath, content)
  }

  /**
   * Generate all three registry files at once.
   * Returns the content strings without writing to disk.
   */
  generate(routes: ScannedRoute[]): { runtime: string; types: string; tree: string } {
    return {
      runtime: this.generateRuntimeContent(routes),
      types: this.generateTypesContent(routes),
      tree: this.generateTreeContent(routes),
    }
  }

  /**
   * Generate and write all registry files (index.ts, schema.d.ts, tree.d.ts)
   * to the given output directory.
   */
  async writeOutput(options: { outputDir: string; routes: ScannedRoute[] }) {
    const result = this.generate(options.routes)
    const dir = options.outputDir.replace(/\/$/, '')

    await Promise.all([
      this.#writeFile(`${dir}/index.ts`, result.runtime),
      this.#writeFile(`${dir}/schema.d.ts`, result.types),
      this.#writeFile(`${dir}/tree.d.ts`, result.tree),
    ])

    return result
  }
}
