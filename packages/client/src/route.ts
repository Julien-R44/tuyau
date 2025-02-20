import type { KyInstance } from 'ky'

import { TuyauRequest } from './request.js'
import { match, parse, exec } from './matchit.js'
import { buildSearchParams, camelCase } from './utils.js'
import type {
  DeepPartial,
  GeneratedRoutes,
  RouteName,
  RouteReturnType,
  RouteUrlParams,
  TuyauQueryOptions,
} from './types.js'

/**
 * RouteHelper is responsible for dealing with named routes registered inside Tuyau
 */
export class RouteHelper<Routes extends GeneratedRoutes> {
  #parsedRoutes: any

  constructor(
    private baseUrl: string,
    private routes: Routes,
    private client: KyInstance,
  ) {
    this.#parsedRoutes = routes?.map((route) => parse(route.path))
  }

  /**
   * Get a route by its name and throw an error if it doesn't exist
   */
  #getRouteByName(name: string) {
    const route = this.routes.find((route) => route.name === name)
    if (!route) throw new Error(`Route ${name} not found`)

    return route
  }

  #getRouteByPath(path: string) {
    const route = this.routes.find((route) => route.path === path)
    if (!route) throw new Error(`Route ${path} not found`)

    return route
  }

  /**
   * Build an URL using the given route path and replace the parameters with
   * the given values
   */
  #buildUrl(path: string, params?: Record<string, string | number> | string[]) {
    let objParams: Record<string, string | number> = {}
    let arrayParams: string[] = []

    if (Array.isArray(params)) {
      arrayParams = params
    } else {
      const entries = Object.entries(params || {}).map(([key, value]) => [key, value])
      objParams = Object.fromEntries(entries)
    }

    let index = 0
    return path.replace(/:([A-Z_a-z]+)/g, (_, key) => {
      const camelCaseKey = camelCase(key)
      if (objParams[camelCaseKey]) return objParams[camelCaseKey].toString()
      if (arrayParams[index]) return arrayParams[index++]

      throw new Error(`Route ${path} is missing the ${camelCaseKey} parameter`)
    })
  }

  /**
   * Get the current location URL
   */
  #location() {
    const {
      host = '',
      pathname = '',
      search = '',
    } = typeof window !== 'undefined' ? window.location : {}

    return { host, pathname, search }
  }

  /**
   * Check if the given params match another params object
   */
  #matchParams(current: Record<string, any>, params: RouteUrlParams<Routes, any, true>) {
    if (!('params' in params) || !params.params) return true

    return Object.entries(params.params!).every(([key, value]) => {
      return value.toString() === current[key].toString()
    })
  }

  /**
   * Check if the route name matches the given wildcard pattern
   *
   * @example
   * #wildcardMatch('users.*', { name: 'users.index' }) // true
   */
  #wildcardMatch(name: string, route: Routes[number]) {
    const regex = new RegExp(`^${name.replace('*', '.*')}$`)
    return regex.test(route.name)
  }

  /**
   * Check if the current route matches the given route name and params
   * If no route name is passed, just return the current route name
   */
  $current<K extends RouteName<Routes> | (string & {})>(
    routeName?: K,
    params?: DeepPartial<RouteUrlParams<Routes, K, true>>,
  ) {
    const { pathname, search } = this.#location()
    const segments = match(pathname, this.#parsedRoutes)

    /**
     * If no route name is passed, just return the current route name
     */
    if (!routeName) return this.#getRouteByPath(segments[0].old).name

    const route = this.#getRouteByPath(segments[0].old)

    if (!this.#wildcardMatch(routeName as string, route)) return false
    if (segments[0].old !== route.path) return false
    if (!params) return true

    /**
     * Parse the params from the URL and camelCase them
     */
    const parsedParams = exec(pathname, segments)
    const paramsObject = Object.fromEntries(
      Object.entries(parsedParams).map(([key, value]) => [camelCase(key), value]),
    )

    /**
     * Ensure passed params and query params match with the current URL
     */
    const paramsMatch = this.#matchParams(paramsObject, params as any)
    const queryMatch = params.query
      ? new URLSearchParams(search).toString() ===
        new URLSearchParams(buildSearchParams(params.query)).toString()
      : true

    return paramsMatch && queryMatch
  }

  /**
   * Make a request to a route by its name
   */
  $route<K extends RouteName<Routes>>(
    name: K,
    params?: RouteUrlParams<Routes, K> extends { params: infer P } ? P : never,
  ): RouteReturnType<Routes, K> {
    const route = this.#getRouteByName(name)

    /**
     * Generate methods like `$get`, `$post`, `$put`, etc
     */
    const result = route.method.reduce((result, method) => {
      result[`$${method.toLowerCase()}`] = (body: any, options: TuyauQueryOptions = {}) => {
        const path = this.#buildUrl(route.path, params as any)

        return new TuyauRequest({
          body,
          path,
          method: method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head',
          client: this.client,
          queryOptions: options,
        })
      }

      return result
    }, {} as any)

    result.method = route.method
    result.name = route.name
    result.path = route.path
    result.params = route.params

    return result
  }

  /**
   * Generate an URL for the given route name
   *
   * @example
   * tuyau.$url('users.index', { query: { page: 1 } })
   * tuyau.$url('users.show', { params: { id: 1 } })
   * tuyau.$url('users.show', { params: ['1'] })
   */
  $url<K extends RouteName<Routes>>(name: K, options?: RouteUrlParams<Routes, K>) {
    const route = this.#getRouteByName(name)
    const pathParams = (options as any)?.params || {}
    const path = this.#buildUrl(route.path, pathParams)

    const url = new URL(path, this.baseUrl)
    url.search = buildSearchParams(options?.query || {})

    return url.toString()
  }

  /**
   * Check if a route with the given name exists
   *
   * You can use `*` as a wildcard character
   *
   * @example
   * tuyau.$has('users.*')
   * tuyau.$has('users.index')
   * tuyau.$has('users.*.show')
   *
   */
  $has(name: RouteName<Routes> | (string & {})) {
    if (!name.includes('*')) return this.routes.some((route) => route.name === name)
    return this.routes.some((route) => this.#wildcardMatch(name, route))
  }
}
