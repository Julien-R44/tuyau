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
 * Generate a single registry entry for a route (types only)
 */
function generateTypesRegistryEntry(route: ScannedRoute): string {
  const requestType = normalizeImportPaths(route.request?.type || '{}')
  const responseType = route.response?.type || 'unknown'
  const { paramsType, paramsTuple } = generateRouteParams(route)
  const routeName = route.name

  return `  '${routeName}': {
    methods: ${JSON.stringify(route.methods)}
    pattern: '${route.pattern}'
    types: {
      body: ${requestType}
      paramsTuple: [${paramsTuple}]
      params: ${paramsType ? `{ ${paramsType} }` : '{}'}
      query: {}
      response: ${responseType}
    }
  }`
}

/**
 * Generate a single registry entry for a route
 */
function generateRegistryEntry(route: ScannedRoute): string {
  const requestType = normalizeImportPaths(route.request?.type || '{}')
  const responseType = route.response?.type || 'unknown'
  const { paramsType, paramsTuple } = generateRouteParams(route)
  const routeName = route.name

  return `  '${routeName}': {
    methods: ${JSON.stringify(route.methods)},
    pattern: '${route.pattern}',
    tokens: ${JSON.stringify(route.tokens)},
    types: placeholder as {
      body: ${requestType}
      paramsTuple: [${paramsTuple}]
      params: ${paramsType ? `{ ${paramsType} }` : '{}'}
      query: {}
      response: ${responseType}
    },
  }`
}

/**
 * Generate the runtime-only registry file content
 */
function generateRuntimeContent(routes: ScannedRoute[]): string {
  const registryEntries = routes.map(generateRuntimeRegistryEntry).join(',\n')

  return `/* eslint-disable prettier/prettier */
import { type AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './registry.schema.d.ts'
const placeholder: any = {}

export const registry = {
${registryEntries}
} as const satisfies Record<string, AdonisEndpoint>
`
}

/**
 * Generate the types-only registry file content
 */
function generateTypesContent(routes: ScannedRoute[]): string {
  const registryEntries = routes.map(generateTypesRegistryEntry).join('\n')

  return `/* eslint-disable prettier/prettier */
/// <reference path="../../adonisrc.ts" />

import type { AdonisEndpoint } from '@tuyau/core/types'
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

  return `/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Infer } from '@vinejs/vine/types'

const placeholder: any = {}
export const registry = {
${registryEntries}
} as const satisfies Record<string, AdonisEndpoint>

declare module '@tuyau/core/types' {
  type Registry = typeof registry
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

        // Generate paths for both files
        const basePath = config.output.replace(/\.(ts|js)$/, '')
        const runtimePath = `${basePath}.ts`
        const typesPath = `${basePath}.schema.d.ts`

        // Write both files
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
