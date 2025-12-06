/**
 * Script to generate registry fixtures for benchmarking react-query types
 */

import fs from 'node:fs'
import path from 'node:path'
import { faker } from '@faker-js/faker'

const nbRoutes = Number.parseInt(process.argv[2]) || 100

const domains = [
  'user',
  'admin',
  'blog',
  'shop',
  'forum',
  'gallery',
  'wiki',
  'market',
  'portfolio',
  'library',
  'cinema',
  'restaurant',
  'garden',
  'weather',
  'sports',
  'recipe',
  'podcast',
  'art',
  'language',
  'pet',
  'travel',
  'fashion',
  'home',
  'education',
  'calendar',
  'inventory',
  'music',
  'game',
  'social',
  'finance',
  'document',
  'network',
  'backup',
  'analytics',
  'subscription',
  'conference',
  'shipping',
  'maintenance',
  'survey',
  'workflow',
  'community',
  'quality',
  'pricing',
  'knowledge',
  'media',
  'collaboration',
  'geolocation',
  'integration',
  'security',
  'recommendation',
  'notification',
  'authentication',
  'authorization',
  'dashboard',
  'report',
  'export',
  'import',
  'sync',
  'search',
  'filter',
  'cart',
  'checkout',
  'payment',
  'billing',
  'invoice',
  'profile',
  'settings',
  'preferences',
  'activity',
  'history',
  'log',
  'message',
  'chat',
  'comment',
  'review',
  'rating',
  'feedback',
  'upload',
  'download',
  'file',
  'image',
  'video',
  'audio',
  'task',
  'project',
  'team',
  'member',
  'role',
  'permission',
  'access',
  'category',
  'tag',
  'label',
  'bookmark',
  'favorite',
  'watchlist',
  'event',
  'schedule',
  'appointment',
  'booking',
  'reservation',
  'product',
  'service',
  'order',
  'shipment',
  'delivery',
  'tracking',
  'campaign',
  'promotion',
  'coupon',
  'discount',
  'offer',
  'deal',
]

const actions = [
  'index',
  'show',
  'create',
  'store',
  'edit',
  'update',
  'destroy',
  'delete',
  'list',
  'get',
  'post',
  'put',
  'patch',
  'remove',
  'add',
  'insert',
  'find',
  'search',
  'filter',
  'sort',
  'paginate',
  'scroll',
  'upload',
  'download',
  'export',
  'import',
  'sync',
  'refresh',
  'activate',
  'deactivate',
  'enable',
  'disable',
  'toggle',
  'switch',
  'approve',
  'reject',
  'accept',
  'decline',
  'confirm',
  'cancel',
  'archive',
  'restore',
  'backup',
  'clone',
  'duplicate',
  'copy',
  'merge',
  'split',
  'combine',
  'separate',
  'group',
  'ungroup',
  'lock',
  'unlock',
  'secure',
  'protect',
  'validate',
  'verify',
  'publish',
  'unpublish',
  'draft',
  'preview',
  'schedule',
  'postpone',
  'favorite',
  'bookmark',
  'like',
  'unlike',
  'share',
  'forward',
  'subscribe',
  'unsubscribe',
  'follow',
  'unfollow',
  'block',
  'unblock',
  'invite',
  'join',
  'leave',
  'kick',
  'ban',
  'mute',
  'unmute',
  'assign',
  'unassign',
  'transfer',
  'move',
  'relocate',
  'migrate',
  'analyze',
  'calculate',
  'compute',
  'process',
  'generate',
  'transform',
]

const httpMethods = [
  { methods: ['GET'], weight: 40 },
  { methods: ['POST'], weight: 25 },
  { methods: ['PUT'], weight: 10 },
  { methods: ['PATCH'], weight: 10 },
  { methods: ['DELETE'], weight: 10 },
  { methods: ['GET', 'HEAD'], weight: 5 },
]

const bodyTypes = [
  '{}',
  '{ title: string; description?: string }',
  '{ name: string; email: string }',
  '{ file: Blob }',
  '{ data: any; metadata?: any }',
  '{ settings: Record<string, any> }',
  '{ filters: any[]; options?: any }',
  '{ content: string; tags?: string[] }',
  '{ amount: number; currency?: string }',
  '{ startDate: string; endDate: string }',
  '{ query: string; limit?: number }',
  '{ userId: string; permissions: string[] }',
  '{ priority: string; status?: string }',
  '{ coordinates: [number, number] }',
  '{ token: string; expiresAt?: string }',
]

const queryTypes = [
  '{}',
  '{ limit?: number; page?: number }',
  '{ search?: string; filter?: string }',
  '{ sort?: string; order?: string }',
  '{ category?: string; tags?: string[] }',
  '{ startDate?: string; endDate?: string }',
  '{ active?: boolean; archived?: boolean }',
  '{ format?: string; locale?: string }',
  '{ includeDeleted?: boolean; expand?: string[] }',
  '{ minPrice?: number; maxPrice?: number }',
]

const responseTypes = [
  '{ success: boolean }',
  '{ id: string; name: string }',
  '{ data: any[]; total: number }',
  '{ token: string; expiresAt: string }',
  '{ url: string; filename: string }',
  '{ status: string; message: string }',
  '{ created: boolean; item: any }',
  '{ updated: boolean; changes: any }',
  '{ deleted: boolean; count: number }',
  '{ results: any[]; pagination: any }',
  '{ metrics: any; charts: any[] }',
  '{ settings: any; preferences: any }',
  '{ profile: any; permissions: string[] }',
  '{ items: any[]; categories: string[] }',
  'any',
]

function getRandomMethod() {
  const totalWeight = httpMethods.reduce((sum, m) => sum + m.weight, 0)
  let random = Math.random() * totalWeight

  for (const method of httpMethods) {
    random -= method.weight
    if (random <= 0) {
      return method.methods
    }
  }
  return ['GET']
}

function generateRouteName(existingNames: Set<string>) {
  let routeName: string
  let attempts = 0

  do {
    const domain = faker.helpers.arrayElement(domains)
    const action = faker.helpers.arrayElement(actions)
    const hasSubDomain = Math.random() > 0.7

    if (hasSubDomain) {
      const subDomain = faker.helpers.arrayElement(domains.filter((d) => d !== domain))
      routeName = `${domain}.${subDomain}.${action}`
    } else {
      routeName = `${domain}.${action}`
    }

    attempts++

    if (attempts > 50) {
      routeName = `${routeName}.${faker.string.alphanumeric(3)}`
      break
    }
  } while (existingNames.has(routeName))

  existingNames.add(routeName)
  return routeName
}

function generatePattern(routeName: string) {
  const parts = routeName.split('.')
  const hasParams = Math.random() > 0.6

  let pattern = `/${parts.join('/')}`

  if (hasParams) {
    const paramCount = Math.random() > 0.8 ? 2 : 1
    const usedParams = new Set<string>()
    const availableParams = [
      'id',
      'userId',
      'itemId',
      'resourceId',
      'entityId',
      'categoryId',
      'groupId',
      'teamId',
    ]

    for (let i = 0; i < paramCount && usedParams.size < availableParams.length; i++) {
      let paramName: string
      do {
        paramName = faker.helpers.arrayElement(availableParams)
      } while (usedParams.has(paramName))

      usedParams.add(paramName)
      pattern += `/:${paramName}`
    }
  }

  return pattern
}

function getParamsFromPattern(pattern: string) {
  const params = pattern.match(/:(\w+)/g)
  if (!params) return { params: '{}', paramsTuple: '[]' }

  const uniqueParamNames = [...new Set(params.map((p) => p.slice(1)))]
  const paramsObj = uniqueParamNames.map((name) => `${name}: string`).join('; ')
  const paramsTuple = uniqueParamNames.map(() => 'string').join(', ')

  return {
    params: `{ ${paramsObj} }`,
    paramsTuple: `[${paramsTuple}]`,
  }
}

interface RouteInfo {
  routeName: string
  methods: string[]
  pattern: string
  params: string
  paramsTuple: string
  body: string
  query: string
  response: string
}

function generateRoute(existingNames: Set<string>): RouteInfo {
  const routeName = generateRouteName(existingNames)
  const methods = getRandomMethod()
  const pattern = generatePattern(routeName)
  const { params, paramsTuple } = getParamsFromPattern(pattern)

  const body =
    methods.includes('GET') || methods.includes('HEAD') || methods.includes('DELETE')
      ? '{}'
      : faker.helpers.arrayElement(bodyTypes)

  const query = faker.helpers.arrayElement(queryTypes)
  const response = faker.helpers.arrayElement(responseTypes)

  return { routeName, methods, pattern, params, paramsTuple, body, query, response }
}

function routeToRegistryEntry(route: RouteInfo): string {
  return `  '${route.routeName}': {
    methods: [${route.methods.map((m) => `'${m}'`).join(', ')}],
    pattern: '${route.pattern}',
    tokens: [],
    types: placeholder as {
      body: ${route.body}
      params: ${route.params}
      paramsTuple: ${route.paramsTuple}
      query: ${route.query}
      response: ${route.response}
    },
  },`
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function buildTreeStructure(routes: RouteInfo[]): Map<string, any> {
  const tree = new Map<string, any>()

  for (const route of routes) {
    const segments = route.routeName.split('.')
    let current = tree

    for (let i = 0; i < segments.length; i++) {
      const segment = toCamelCase(segments[i])
      const isLast = i === segments.length - 1

      if (isLast) {
        current.set(segment, { routeName: route.routeName })
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

function generateTreeInterface(tree: Map<string, any>, indent: number = 2): string {
  const spaces = ' '.repeat(indent)
  const lines: string[] = []

  for (const [key, value] of tree) {
    if (value instanceof Map) {
      lines.push(`${spaces}${key}: {`)
      lines.push(generateTreeInterface(value, indent + 2))
      lines.push(`${spaces}}`)
    } else {
      lines.push(`${spaces}${key}: GeneratedRoutes['${value.routeName}']`)
    }
  }

  return lines.join('\n')
}

function generateFixture(numberOfRoutes: number) {
  const routes: RouteInfo[] = []
  const existingNames = new Set<string>()

  for (let i = 0; i < numberOfRoutes; i++) {
    routes.push(generateRoute(existingNames))
  }

  const registryEntries = routes.map(routeToRegistryEntry).join('\n')
  const tree = buildTreeStructure(routes)
  const treeInterface = generateTreeInterface(tree)

  return `import type { AdonisEndpoint } from '@tuyau/core/types'

const placeholder: any = {}

const routes = {
${registryEntries}
} as const satisfies Record<string, AdonisEndpoint>

type GeneratedRoutes = typeof routes

/**
 * Pre-computed API definition tree
 */
export interface GeneratedApiDefinition {
${treeInterface}
}

export const generatedRegistry = {
  routes,
  $tree: {} as GeneratedApiDefinition,
}
`
}

const fixtureContent = generateFixture(nbRoutes)
const outputPath = path.join(process.cwd(), `benchmarks/fixtures/generated-fixture-${nbRoutes}.ts`)

fs.writeFileSync(outputPath, fixtureContent)

console.log(`Generated fixture with ${nbRoutes} routes at: ${outputPath}`)
console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`)
