import { dirname } from 'node:path'
import { writeFile, mkdir } from 'node:fs/promises'
import type { ScannedRoute, RouterHooks } from '@adonisjs/assembler/types'

interface GenerateRegistryConfig {
  /**
   * Path to write the generated registry file
   * @default ./.adonisjs/client/registry.ts
   */
  output?: string

  /**
   * Whether to split runtime values and TypeScript types into separate files
   * When true, generates registry.ts (runtime) and registry.schema.d.ts (types)
   * When false, generates a single file with both runtime and types
   * @default true
   */
  splitTypesFromRuntime?: boolean

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
 * Filter routes based on only/except patterns
 */
function filterRoutes(
  routes: ScannedRoute[],
  filters?: GenerateRegistryConfig['routes'],
): ScannedRoute[] {
  if (!filters) return routes

  const { only, except } = filters

  if (only && except)
    throw new Error('Cannot use both "only" and "except" filters at the same time')

  if (only) {
    return routes.filter((route) => only.some((pattern) => matchesPattern(route.name, pattern)))
  }

  if (except) {
    return routes.filter((route) => !except.some((pattern) => matchesPattern(route.name, pattern)))
  }

  return routes
}

/**
 * Generate route parameters types and tuple
 */
function generateRouteParams(route: ScannedRoute) {
  const dynamicParams = route.tokens.filter((token) => token.type === 1)
  const paramsType = dynamicParams.map((token) => `${token.val}: string`).join('; ')
  const paramsTuple = dynamicParams.map(() => 'string').join(', ')

  return { paramsType, paramsTuple }
}

/**
 * Convert a string to camelCase
 * Examples: 'get_me' -> 'getMe', 'foo_bar_baz' -> 'fooBarBaz'
 */
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Build a nested tree structure from flat route names
 * Example: ['auth.login', 'auth.register', 'users.show'] ->
 * { auth: { login: ..., register: ... }, users: { show: ... } }
 */
function buildTreeStructure(routes: ScannedRoute[]): Map<string, any> {
  const tree = new Map<string, any>()

  for (const route of routes) {
    const segments = route.name.split('.')
    let current = tree

    for (let i = 0; i < segments.length; i++) {
      const segment = toCamelCase(segments[i])
      const isLast = i === segments.length - 1

      if (isLast) {
        current.set(segment, { routeName: route.name, route })
      } else {
        if (!current.has(segment)) {
          current.set(segment, new Map<string, any>())
        }
        current = current.get(segment)
      }
    }
  }

  return tree
}

/**
 * Generate TypeScript interface from tree structure
 */
function generateTreeInterface(tree: Map<string, any>, indent: number = 2): string {
  const spaces = ' '.repeat(indent)
  const lines: string[] = []

  for (const [key, value] of tree) {
    if (value instanceof Map) {
      lines.push(`${spaces}${key}: {`)
      lines.push(generateTreeInterface(value, indent + 2))
      lines.push(`${spaces}}`)
    } else {
      lines.push(`${spaces}${key}: Registry['${value.routeName}']`)
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
 * Generate a single registry entry for a route (runtime values only)
 */
function generateRuntimeRegistryEntry(route: ScannedRoute): string {
  const routeName = route.name

  return `  '${routeName}': {
    methods: ${JSON.stringify(route.methods)},
    pattern: '${route.pattern}',
    tokens: ${JSON.stringify(route.tokens)},
    types: placeholder as Registry['${routeName}']['types'],
  }`
}

/**
 * Wrap ReturnType with Awaited to unwrap Promise types from async methods
 * Pretty hackish, should probably also be fixed in adonisjs/assembler. Lets do that later
 */
function wrapResponseType(responseType: string): string {
  if (responseType === 'unknown' || responseType === '{}') return responseType
  // Wrap ReturnType<...> with Awaited<...> to handle async methods
  if (responseType.startsWith('ReturnType<')) {
    return `Awaited<${responseType}>`
  }
  return responseType
}

/**
 * Generate a single registry entry for a route (types only)
 */
function generateTypesRegistryEntry(route: ScannedRoute): string {
  const requestType = normalizeImportPaths(route.request?.type || '{}')
  const responseType = wrapResponseType(route.response?.type || 'unknown')
  const { paramsType, paramsTuple } = generateRouteParams(route)
  const routeName = route.name

  // Use type helpers to extract body and query from the validator
  const hasValidator = requestType !== '{}'
  const bodyType = hasValidator ? `ExtractBody<${requestType}>` : '{}'
  const queryType = hasValidator ? `ExtractQuery<${requestType}>` : '{}'

  return `  '${routeName}': {
    methods: ${JSON.stringify(route.methods)}
    pattern: '${route.pattern}'
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
 * Generate a single registry entry for a route
 */
function generateRegistryEntry(route: ScannedRoute): string {
  const requestType = normalizeImportPaths(route.request?.type || '{}')
  const responseType = wrapResponseType(route.response?.type || 'unknown')
  const { paramsType, paramsTuple } = generateRouteParams(route)
  const routeName = route.name

  // Use type helpers to extract body and query from the validator
  const hasValidator = requestType !== '{}'
  const bodyType = hasValidator ? `ExtractBody<${requestType}>` : '{}'
  const queryType = hasValidator ? `ExtractQuery<${requestType}>` : '{}'

  return `  '${routeName}': {
    methods: ${JSON.stringify(route.methods)},
    pattern: '${route.pattern}',
    tokens: ${JSON.stringify(route.tokens)},
    types: placeholder as {
      body: ${bodyType}
      paramsTuple: [${paramsTuple}]
      params: ${paramsType ? `{ ${paramsType} }` : '{}'}
      query: ${queryType}
      response: ${responseType}
    },
  }`
}

/**
 * Generate the runtime-only registry file content
 */
function generateRuntimeContent(routes: ScannedRoute[]): string {
  const registryEntries = routes.map(generateRuntimeRegistryEntry).join(',\n')
  const tree = buildTreeStructure(routes)
  const treeInterface = generateTreeInterface(tree)

  return `/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './registry.schema.d.ts'
const placeholder: any = {}

export interface ApiDefinition {
${treeInterface}
}

const routes = {
${registryEntries},
} as const satisfies Record<string, AdonisEndpoint>

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserApiDefinition extends ApiDefinition {}
}
`
}

/**
 * Generate the types-only registry file content
 */
function generateTypesContent(routes: ScannedRoute[]): string {
  const registryEntries = routes.map(generateTypesRegistryEntry).join('\n')

  return `/* eslint-disable prettier/prettier */
/// <reference path="../../adonisrc.ts" />

import type { ExtractBody, ExtractQuery } from '@tuyau/core/types'
import type { Infer } from '@vinejs/vine/types'

export interface Registry {
${registryEntries}
}

declare module '@tuyau/core/types' {
  export interface UserRegistry extends Registry {}
}
`
}

/**
 * Generate the complete registry file content (legacy)
 */
function generateRegistryContent(routes: ScannedRoute[]): string {
  const registryEntries = routes.map(generateRegistryEntry).join(',\n')
  const tree = buildTreeStructure(routes)
  const treeInterface = generateTreeInterface(tree)

  return `/* eslint-disable prettier/prettier */
import type { AdonisEndpoint, ExtractBody, ExtractQuery } from '@tuyau/core/types'
import type { Infer } from '@vinejs/vine/types'

const placeholder: any = {}

interface ApiDefinition {
${treeInterface}
}

const routes = {
${registryEntries}
} as const satisfies Record<string, AdonisEndpoint>

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  type Registry = typeof routes
  export interface UserRegistry extends Registry {}
}
`
}

export function generateRegistry(options?: GenerateRegistryConfig): {
  run(devServer: any, routesScanner: any): Promise<void>
} {
  const config = {
    output: './.adonisjs/client/registry.ts',
    splitTypesFromRuntime: true,
    ...options,
  }

  return {
    async run(devServer, routesScanner) {
      const startTime = process.hrtime()
      const scannedRoutes = routesScanner.getScannedRoutes()

      const filteredRoutes = filterRoutes(scannedRoutes, config.routes)
      if (config.splitTypesFromRuntime) {
        // Generate separate runtime and types files
        const runtimeContent = generateRuntimeContent(filteredRoutes)
        const typesContent = generateTypesContent(filteredRoutes)

        // Generate paths for files
        const basePath = config.output.replace(/\.(ts|js)$/, '')
        const runtimePath = `${basePath}.ts`
        const typesPath = `${basePath}.schema.d.ts`

        // Write files
        await writeOutputFile(runtimePath, runtimeContent)
        await writeOutputFile(typesPath, typesContent)

        devServer.ui.logger.info(`created ${runtimePath}`, { startTime })
        devServer.ui.logger.info(`created ${typesPath}`, { startTime })
      } else {
        const registryContent = generateRegistryContent(filteredRoutes)
        await writeOutputFile(config.output, registryContent)
        devServer.ui.logger.info(`created ${config.output}`, { startTime })
      }
    },
  } satisfies RouterHooks['routesScanned'][number]
}
