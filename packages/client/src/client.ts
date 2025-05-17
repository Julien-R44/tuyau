import ky from 'ky'

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

export function createTuyauRecursiveProxy(
  cb: (options: {
    executeIfRouteParamCall: (options: { fnName: string; body: any }) => any
    args: any[]
    paths: string[]
  }) => any,
  paths: string[] = [],
): any {
  function executeIfRouteParamCall(options: { fnName: string; body: any }) {
    const isMethodCall = prefixedMethods.includes(options.fnName)
    if (!isMethodCall && typeof options.body === 'object') {
      return createTuyauRecursiveProxy(cb, [...paths, Object.values(options.body)[0] as string])
    }
  }

  return new Proxy(cb, {
    get(_, param: string) {
      return createTuyauRecursiveProxy(cb, [...paths, param])
    },

    apply(_, __, args) {
      return cb({ args, paths, executeIfRouteParamCall })
    },
  })
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

  const routeHelper = new RouteHelper(baseUrl, options.api?.routes, client)
  return createTuyauRecursiveProxy(({ args, paths, executeIfRouteParamCall }) => {
    const fnName = paths.at(-1)
    const [body, queryOptions] = args

    if (fnName === '$fetch') {
      paths = body.paths
      const method = paths[paths.length - 1].slice(1) as (typeof methods)[number]
      const isGetOrHead = ['get', 'head'].includes(method)

      return new TuyauRequest({
        body,
        client,
        method,
        path: paths.slice(0, -1).join('/'),
        queryOptions: isGetOrHead ? body : queryOptions,
      }).unwrap()
    }

    /**
     * First, check if it's a route helper method.
     */
    if (paths.length === 1 && ['$has', '$route', '$url', '$current'].includes(fnName!)) {
      const method = fnName as '$has' | '$route' | '$url'
      return routeHelper[method](body, queryOptions)
    }

    if (fnName === '$url') {
      const searchParams = buildSearchParams(body?.query)
      const url = new URL(paths.join('/').replace('/$url', ''), baseUrl)
      return url.toString() + searchParams
    }

    /**
     * Then, check if it's a route parameter call like `tuyau.users({ id: 1 })`
     */
    const newProxy = executeIfRouteParamCall({ fnName: fnName!, body })
    if (newProxy) return newProxy

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
  })
}
