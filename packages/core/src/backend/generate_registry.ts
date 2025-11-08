import { dirname } from 'node:path'
import string from '@adonisjs/core/helpers/string'
import { writeFile, mkdir } from 'node:fs/promises'
import type { ScannedRoute, RouterHooks } from '@adonisjs/assembler/types'

interface GenerateRegistryConfig {
  /**
   * Path to write the generated registry file
   * @default ./.adonisjs/client/registry.ts
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
 * Generate a single registry entry for a route
 */
function generateRegistryEntry(route: ScannedRoute): string {
  const requestType = route.request?.type || '{}'
  const responseType = route.response?.type || 'unknown'
  const { paramsType, paramsTuple } = generateRouteParams(route)
  const routeName = route.name
    .split('.')
    .map((segment) => string.camelCase(segment))
    .join('.')

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
 * Generate the complete registry file content
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
    ...options,
  }

  return {
    async run(devServer, routesScanner) {
      const startTime = process.hrtime()
      const scannedRoutes = routesScanner.getScannedRoutes()

      const filteredRoutes = filterRoutes(scannedRoutes, config.routes)
      const registryContent = generateRegistryContent(filteredRoutes)

      await writeOutputFile(config.output, registryContent)

      devServer.ui.logger.info(`created ${config.output}`, { startTime })
    },
  } satisfies RouterHooks['routesScanned'][number]
}
