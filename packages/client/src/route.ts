import type { KyInstance } from 'ky'

import { TuyauRequest } from './request.js'
import { buildSearchParams, snakeCase } from './utils.js'
import type {
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
  constructor(
    private baseUrl: string,
    private routes: Routes,
    private client: KyInstance,
  ) {}

  /**
   * Get a route by its name and throw an error if it doesn't exist
   */
  #getRoute(name: string) {
    const route = this.routes.find((route) => route.name === name)
    if (!route) throw new Error(`Route ${name} not found`)

    return route
  }

  /**
   * Build an URL using the given route path and replace the parameters with
   * the given values
   */
  #buildUrl(path: string, params: Record<string, string | number> | string[]) {
    let objParams: Record<string, string | number> = {}
    let arrayParams: string[] = []

    if (Array.isArray(params)) {
      arrayParams = params
    } else {
      const entries = Object.entries(params).map(([key, value]) => [snakeCase(key), value])
      objParams = Object.fromEntries(entries)
    }

    let index = 0
    return path.replace(/:([A-Z_a-z]+)/g, (_, key) => {
      if (objParams[key]) return objParams[key].toString()
      if (arrayParams[index]) return arrayParams[index++]

      throw new Error(`Route ${path} is missing the ${key} parameter`)
    })
  }

  /**
   * Make a request to a route by its name
   */
  $route<K extends RouteName<Routes>>(
    name: K,
    params?: RouteUrlParams<Routes, K> extends { params: infer P } ? P : never,
  ): RouteReturnType<Routes, K> {
    const route = this.#getRoute(name)

    /**
     * Generate methods like `$get`, `$post`, `$put`, etc
     */
    return route.method.reduce((result, method) => {
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
    const route = this.#getRoute(name)
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

    const regex = new RegExp(`^${name.replace('*', '.*')}$`)
    return this.routes.some((route) => regex.test(route.name))
  }
}
