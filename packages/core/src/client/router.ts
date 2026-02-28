import { buildSearchParams } from './serializer.ts'
import type { AdonisEndpoint, CurrentRouteOptions, StrKeys } from './types/types.ts'

/**
 * Handles route resolution for the Tuyau client: checking if routes exist
 * in the registry and determining the current route from `window.location`.
 */
export class TuyauRouter<Routes extends Record<string, AdonisEndpoint>> {
  #entries: [StrKeys<Routes>, Routes[StrKeys<Routes>]][]
  #baseUrl: string

  constructor(entries: [StrKeys<Routes>, Routes[StrKeys<Routes>]][], baseUrl: string) {
    this.#entries = entries
    this.#baseUrl = baseUrl
  }

  /**
   * Matches a route name against a pattern that may contain `*` wildcards.
   * `*` matches one or more dot-separated segments via recursive backtracking.
   */
  static matchesRouteNamePattern(routeName: string, pattern: string): boolean {
    if (pattern === routeName) return true
    if (!pattern.includes('*')) return false

    const patternParts = pattern.split('.')
    const routeParts = routeName.split('.')

    function match(pIdx: number, rIdx: number): boolean {
      if (pIdx === patternParts.length) return rIdx === routeParts.length

      if (patternParts[pIdx] === '*') {
        const remainingPattern = patternParts.length - pIdx - 1
        for (let i = rIdx + 1; i <= routeParts.length - remainingPattern; i++) {
          if (match(pIdx + 1, i)) return true
        }
        return false
      }

      if (rIdx >= routeParts.length) return false
      if (patternParts[pIdx] !== routeParts[rIdx]) return false

      return match(pIdx + 1, rIdx + 1)
    }

    return match(0, 0)
  }

  /**
   * Matches a URL pathname against an AdonisJS route pattern and extracts
   * dynamic parameters. Supports `:param`, `:param?` (optional), and `*` (wildcard).
   *
   * Returns a record of extracted params on match, or `null` on mismatch.
   */
  static matchPathAgainstPattern(pathname: string, pattern: string): Record<string, string> | null {
    const urlSegments = pathname.split('/').filter(Boolean)
    const patternSegments = pattern.split('/').filter(Boolean)
    const params: Record<string, string> = {}

    let ui = 0
    for (const seg of patternSegments) {
      if (seg === '*') {
        if (ui >= urlSegments.length) return null
        params['*'] = urlSegments.slice(ui).join('/')
        return params
      }

      if (seg.startsWith(':')) {
        const optional = seg.endsWith('?')
        const name = seg.slice(1, optional ? -1 : undefined)

        if (ui < urlSegments.length) {
          params[name] = urlSegments[ui++]
        } else if (!optional) {
          return null
        }

        continue
      }

      if (ui >= urlSegments.length || urlSegments[ui] !== seg) return null
      ui++
    }

    return ui === urlSegments.length ? params : null
  }

  #getCurrentPathname(): string | undefined {
    if (typeof globalThis.window === 'undefined') return undefined

    const pathname = globalThis.window.location.pathname
    const basePathname = new URL(this.#baseUrl).pathname

    if (basePathname !== '/' && pathname.startsWith(basePathname)) {
      return pathname.slice(basePathname.length) || '/'
    }

    return pathname
  }

  #isNavigableRoute(endpoint: Routes[StrKeys<Routes>]) {
    return endpoint.methods.includes('GET') || endpoint.methods.includes('HEAD')
  }

  #findCurrentRouteName(pathname: string): StrKeys<Routes> | undefined {
    for (const [name, endpoint] of this.#entries) {
      if (!this.#isNavigableRoute(endpoint)) continue
      if (TuyauRouter.matchPathAgainstPattern(pathname, endpoint.pattern)) return name
    }

    return undefined
  }

  #matchesCurrentRoute(
    pathname: string,
    routeName: string,
    options?: CurrentRouteOptions,
  ): boolean {
    for (const [name, endpoint] of this.#entries) {
      if (!this.#isNavigableRoute(endpoint)) continue
      if (!TuyauRouter.matchesRouteNamePattern(name, routeName)) continue

      const params = TuyauRouter.matchPathAgainstPattern(pathname, endpoint.pattern)
      if (!params) continue

      if (options?.params) {
        const mismatch = Object.entries(options.params).some(
          ([key, value]) => params[key] !== String(value),
        )
        if (mismatch) continue
      }

      if (options?.query) {
        if (!this.#matchesQueryString(globalThis.window.location.search, options.query)) continue
      }

      return true
    }

    return false
  }

  #parseQueryString(search: string): Record<string, string | string[]> {
    if (!search || search === '?') return {}

    const result: Record<string, string | string[]> = {}
    for (const [key, value] of new URLSearchParams(search)) {
      const current = result[key]

      if (current === undefined) {
        result[key] = value
        continue
      }

      result[key] = Array.isArray(current) ? [...current, value] : [current, value]
    }

    return result
  }

  #matchesQueryString(search: string, query: Record<string, any>): boolean {
    const currentQuery = this.#parseQueryString(search)
    const expectedQuery = this.#parseQueryString(buildSearchParams(query))

    return Object.entries(expectedQuery).every(([key, value]) => {
      const currentValue = currentQuery[key]
      if (currentValue === undefined) return false

      if (Array.isArray(value)) {
        return Array.isArray(currentValue)
          ? value.length === currentValue.length &&
              value.every((entry, index) => currentValue[index] === entry)
          : value.length === 1 && currentValue === value[0]
      }

      return Array.isArray(currentValue)
        ? currentValue.length === 1 && currentValue[0] === value
        : currentValue === value
    })
  }

  /**
   * Checks if a route name exists in the registry.
   */
  has(routeName: StrKeys<Routes>): boolean {
    return this.#entries.some(([name]) => TuyauRouter.matchesRouteNamePattern(name, routeName))
  }

  /**
   * Determines the current route based on `window.location`.
   *
   * - **No arguments** — returns the current route name, or `undefined`
   *   if no route matches (or running server-side).
   * - **With a route name** — returns `true` if the current URL matches
   *   that route. Supports `*` wildcards.
   * - **With options** — additionally checks that the current URL params
   *   and/or query match the provided values.
   */
  current(): StrKeys<Routes> | undefined
  current(routeName: StrKeys<Routes> | (string & {}), options?: CurrentRouteOptions): boolean
  current(
    routeName?: StrKeys<Routes> | (string & {}),
    options?: CurrentRouteOptions,
  ): StrKeys<Routes> | boolean | undefined {
    const pathname = this.#getCurrentPathname()
    if (!pathname) return routeName ? false : undefined

    if (!routeName) return this.#findCurrentRouteName(pathname)

    return this.#matchesCurrentRoute(pathname, routeName, options)
  }
}
