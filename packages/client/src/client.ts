import ky from 'ky'
import type { KyInstance } from 'ky'

import { RouteHelper } from './route.js'
import { TuyauRequest } from './request.js'
import { buildSearchParams } from './utils.js'
import type {
  TuyauOptions,
  GeneratedRoutes,
  TuyauRpcClient,
  ApiDefinition,
  TuyauClient,
} from './types.js'

const methods = ['get', 'post', 'put', 'delete', 'patch', 'head'] as const
const prefixedMethods = methods.map((method) => `$${method}`)

function createProxy(options: {
  client: KyInstance
  baseUrl: string
  config: any
  paths?: string[]
}): any {
  const { client, baseUrl, config, paths = [] } = options
  const routeHelper = new RouteHelper(baseUrl, config.api?.routes, client)

  return new Proxy(() => {}, {
    get(_, param: string) {
      return createProxy({ ...options, paths: param === 'index' ? paths : [...paths, param] })
    },

    apply(_, __, [body, queryOptions]) {
      const lastPath = paths.at(-1)

      /**
       * First, check if it's a route helper method.
       */
      if (paths.length === 1 && ['$has', '$route', '$url', '$current'].includes(lastPath!)) {
        const method = lastPath as '$has' | '$route' | '$url'
        return routeHelper[method](body, queryOptions)
      }

      if (lastPath === '$url') {
        const searchParams = buildSearchParams(body?.query)
        const url = new URL(paths.join('/').replace('/$url', ''), baseUrl)
        return url.toString() + searchParams
      }

      /**
       * Then, check if it's a route parameter call like `tuyau.users({ id: 1 })`
       */
      const isMethodCall = prefixedMethods.includes(lastPath as any)
      if (!isMethodCall && typeof body === 'object') {
        return createProxy({ ...options, paths: [...paths, Object.values(body)[0] as string] })
      }

      /**
       * Otherwise, it's time to make the final request.
       */
      const method = paths[paths.length - 1].slice(1) as (typeof methods)[number]
      const isGetOrHead = ['get', 'head'].includes(method)
      return new TuyauRequest({
        body,
        client,
        method,
        path: paths.slice(0, -1).join('/'),
        queryOptions: isGetOrHead ? body : queryOptions,
      })
    },
  })
}

/**
 * Automatically append the csrf token to the request headers
 */
function appendCsrfToken(request: Request) {
  const xCsrfToken = globalThis.document?.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))

  if (!xCsrfToken) return
  request.headers.set('X-XSRF-TOKEN', decodeURIComponent(xCsrfToken.split('=')[1]))
}

/**
 * Create a new Tuyau client
 */
export function createTuyau<const Api extends ApiDefinition>(
  options: TuyauOptions<Api>,
): Api['routes'] extends GeneratedRoutes
  ? TuyauClient<Api['definition'], Api['routes']>
  : TuyauRpcClient<Api['definition']> {
  options.plugins?.forEach((plugin) => plugin({ options }))

  const baseUrl = options.baseUrl
  const client = ky.create({
    prefixUrl: baseUrl,
    throwHttpErrors: false,
    ...options,
    hooks: {
      ...options.hooks,
      beforeRequest: [...(options.hooks?.beforeRequest || []), appendCsrfToken],
    },
  })

  return createProxy({ client, baseUrl, config: options })
}
