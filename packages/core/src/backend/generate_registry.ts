import './types.js'

import { dirname } from 'node:path'
import { writeFile, mkdir } from 'node:fs/promises'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { ScannedRoute, AllHooks, RoutesListItem } from '@adonisjs/assembler/types'

interface GenerateRegistryConfig {
  /**
   * Path to write the generated registry directory
   * @default ./.adonisjs/client/registry
   */
  output?: string

  /**
   * Routes filtering configuration
   */
  routes?: {
    /**
     * Only include routes matching these patterns (route names)
     * Can be strings, regex patterns, or functions
     */
    only?: Array<string | RegExp | ((routeName: string) => boolean)>

    /**
     * Exclude routes matching these patterns (route names)
     * Can be strings, regex patterns, or functions
     */
    except?: Array<string | RegExp | ((routeName: string) => boolean)>
  }
}

/**
 * Write a file to disk, ensuring the directory exists
 */
async function writeOutputFile(filePath: string, content: string) {
  const dir = dirname(filePath)
  await mkdir(dir, { recursive: true })
  await writeFile(filePath, content)
}

/**
 * Check if a route name matches a filter pattern
 */
function matchesPattern(
  routeName: string,
  pattern: string | RegExp | ((routeName: string) => boolean),
): boolean {
  if (typeof pattern === 'string') return routeName.includes(pattern)
  if (pattern instanceof RegExp) return pattern.test(routeName)
  if (typeof pattern === 'function') return pattern(routeName)

  return false
}

/**
 * Filter route based on only/except patterns
 */
function filterRoute(route: RoutesListItem, filters?: GenerateRegistryConfig['routes']): boolean {
  if (!filters) {
    return true
  }

  const { only, except } = filters

  if (only && except)
    throw new Error('Cannot use both "only" and "except" filters at the same time')

  if (only) {
    return only.some((pattern) => matchesPattern(route.name!, pattern))
  }

  if (except) {
    return !except.some((pattern) => matchesPattern(route.name!, pattern))
  }

  return true
}

/**
 * Generate route parameters types and tuple
 */
function generateRouteParams(route: ScannedRoute) {
  const dynamicParams = route.tokens.filter((token) => token.type === 1)
  const paramsType = dynamicParams.map((token) => `${token.val}: ParamValue`).join('; ')
  const paramsTuple = dynamicParams.map(() => 'ParamValue').join(', ')

  return { paramsType, paramsTuple }
}

/**
 * Build a nested tree structure from flat route names
 * Example: ['auth.login', 'auth.register', 'users.show'] ->
 * { auth: { login: ..., register: ... }, users: { show: ... } }
 *
 * Handles the case where a route name is both a leaf AND a prefix for other routes.
 * Example: 'auth.login' and 'auth.login.render' can coexist by using $self key.
 */
function buildTreeStructure(routes: ScannedRoute[]): Map<string, any> {
  const tree = new Map<string, any>()

  for (const route of routes) {
    const segments = route.name.split('.')
    let current = tree

    for (let i = 0; i < segments.length; i++) {
      const segment = stringHelpers.camelCase(segments[i])
      const isLast = i === segments.length - 1

      if (isLast) {
        // Check if segment already exists as a Map (intermediate node with children)
        if (current.has(segment) && current.get(segment) instanceof Map) {
          // Add the route as $self to the existing Map
          current.get(segment).set('$self', { routeName: route.name, route })
        } else {
          current.set(segment, { routeName: route.name, route })
        }
      } else {
        if (!current.has(segment)) {
          current.set(segment, new Map<string, any>())
        } else {
          const existing = current.get(segment)
          // If existing is a leaf (not a Map), convert it to a Map with $self
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
 * Generate TypeScript interface from tree structure using typeof routes
 * Handles intersection types where a node is both an endpoint AND has children.
 */
function generateTreeInterface(tree: Map<string, any>, indent: number = 2): string {
  const spaces = ' '.repeat(indent)
  const lines: string[] = []

  for (const [key, value] of tree) {
    // Skip $self entries here, they are handled by the parent
    if (key === '$self') continue

    if (value instanceof Map) {
      const selfRoute = value.get('$self')
      if (selfRoute) {
        // Node is both a route AND has children - use intersection type
        lines.push(`${spaces}${key}: typeof routes['${selfRoute.routeName}'] & {`)
        lines.push(generateTreeInterface(value, indent + 2))
        lines.push(`${spaces}}`)
      } else {
        lines.push(`${spaces}${key}: {`)
        lines.push(generateTreeInterface(value, indent + 2))
        lines.push(`${spaces}}`)
      }
    } else {
      lines.push(`${spaces}${key}: typeof routes['${value.routeName}']`)
    }
  }

  return lines.join('\n')
}

/**
 * Normalize import paths in type strings by converting relative paths to subpath imports.
 * For example: `import('app/validators/user.ts')` becomes `import('#app/validators/user')`
 *
 * Pretty hackish, probably something to improve inside @adonisjs/assembler itself but lets
 * keep it here for now.
 */
function normalizeImportPaths(typeString: string): string {
  return typeString.replace(/import\('app\//g, "import('#app/").replace(/\.ts'\)/g, "')")
}

/**
 * Sanitize tokens to only include properties expected by ClientRouteMatchItTokens
 * Removes matcher and other server-only properties
 */
function sanitizeTokens(tokens: ScannedRoute['tokens']) {
  return tokens.map(({ old, type, val, end }) => ({ old, type, val, end }))
}

/**
 * Generate a single registry entry for a route (runtime values only)
 */
function generateRuntimeRegistryEntry(route: ScannedRoute): string {
  const routeName = route.name
  const sanitizedTokens = sanitizeTokens(route.tokens)

  return `  '${routeName}': {
    methods: ${JSON.stringify(route.methods)},
    pattern: '${route.pattern}',
    domain: '${route.domain}',
    tokens: ${JSON.stringify(sanitizedTokens)},
    types: placeholder as Registry['${routeName}']['types'],
  }`
}

/**
 * Wrap response type with ExtractResponse and Awaited to:
 * 1. Unwrap Promise types from async methods
 * 2. Extract __response property from typed response methods (ok(), created(), etc.)
 */
function wrapResponseType(responseType: string): string {
  if (responseType === 'unknown' || responseType === '{}') return responseType

  if (responseType.startsWith('ReturnType<')) {
    return `ExtractResponse<Awaited<${responseType}>>`
  }

  return `ExtractResponse<${responseType}>`
}

/**
 * Determine body and query types based on HTTP method and validator presence
 *
 * For GET/HEAD: use ExtractQueryForGet to exclude headers/cookies/params from query
 * For POST/PUT/PATCH/DELETE: use ExtractBody/ExtractQuery to handle both body and query params
 * This allows POST requests to have query params if the validator uses { query: {...} } wrapper
 */
function determineBodyAndQueryTypes(options: { methods: string[]; requestType: string }) {
  const { methods, requestType } = options
  const primaryMethod = methods[0]
  const isGetLike = primaryMethod === 'GET' || primaryMethod === 'HEAD'
  const hasValidator = requestType !== '{}'

  if (!hasValidator) {
    return { bodyType: '{}', queryType: '{}' }
  }

  if (isGetLike) {
    return { bodyType: '{}', queryType: `ExtractQueryForGet<${requestType}>` }
  }

  return {
    bodyType: `ExtractBody<${requestType}>`,
    queryType: `ExtractQuery<${requestType}>`,
  }
}

/**
 * Generate a single registry entry for a route (types only)
 */
function generateTypesRegistryEntry(route: ScannedRoute): string {
  const requestType = normalizeImportPaths(route.request?.type || '{}')
  const responseType = wrapResponseType(route.response?.type || 'unknown')
  const { paramsType, paramsTuple } = generateRouteParams(route)
  const routeName = route.name

  const { bodyType, queryType } = determineBodyAndQueryTypes({
    methods: route.methods,
    requestType,
  })

  return `  '${routeName}': {
    methods: ${JSON.stringify(route.methods)}
    pattern: '${route.pattern}'
    domain: '${route.domain}'
    types: {
      body: ${bodyType}
      paramsTuple: [${paramsTuple}]
      params: ${paramsType ? `{ ${paramsType} }` : '{}'}
      query: ${queryType}
      response: ${responseType}
    }
  }`
}

/**
 * Generate the runtime-only registry file content
 */
function generateRuntimeContent(routes: ScannedRoute[]): string {
  const registryEntries = routes.map(generateRuntimeRegistryEntry).join(',\n')

  return `/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
${registryEntries},
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
`
}

/**
 * Generate the tree types file content
 */
function generateTreeContent(routes: ScannedRoute[]): string {
  const tree = buildTreeStructure(routes)
  const treeInterface = generateTreeInterface(tree)

  return `/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
${treeInterface}
}
`
}

/**
 * Generate the types-only registry file content
 */
function generateTypesContent(routes: ScannedRoute[]): string {
  const registryEntries = routes.map(generateTypesRegistryEntry).join('\n')

  return `/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
${registryEntries}
}
`
}

export function generateRegistry(options?: GenerateRegistryConfig): {
  run(devServer: any, routesScanner: any): Promise<void>
} {
  const config = {
    output: './.adonisjs/client/registry',
    ...options,
  }

  return {
    async run(_, hooks) {
      hooks.add('routesScanning', (_, routesScanner) => {
        routesScanner.filter((route) => {
          return filterRoute(route, config.routes)
        })
      })
      hooks.add('routesScanned', async (devServer, routesScanner) => {
        const startTime = process.hrtime()
        const scannedRoutes = routesScanner.getScannedRoutes()

        const runtimeContent = generateRuntimeContent(scannedRoutes)
        const typesContent = generateTypesContent(scannedRoutes)
        const treeContent = generateTreeContent(scannedRoutes)

        const registryDir = config.output.replace(/\/$/, '')
        const runtimePath = `${registryDir}/index.ts`
        const typesPath = `${registryDir}/schema.d.ts`
        const treePath = `${registryDir}/tree.d.ts`

        await Promise.all([
          writeOutputFile(runtimePath, runtimeContent),
          writeOutputFile(typesPath, typesContent),
          writeOutputFile(treePath, treeContent),
        ])

        devServer.ui.logger.info(`tuyau: created api client registry (${registryDir})`, {
          startTime,
        })
      })
    },
  } satisfies AllHooks['init'][number]
}
