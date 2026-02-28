import { serialize } from 'object-to-formdata'
import ky, { HTTPError, type KyInstance } from 'ky'
import { createUrlBuilder, type UrlFor } from '@adonisjs/http-server/client/url_builder'

import { buildSearchParams } from './serializer.ts'
import { parseResponse, TuyauHTTPError, TuyauNetworkError } from './errors.ts'
import {
  isObject,
  isReactNative,
  isServer,
  removeSlash,
  segmentsToKebabRouteName,
  segmentsToRouteName,
} from './utils.ts'
import type {
  AdonisEndpoint,
  EndpointByMethodPattern,
  InferRoutes,
  InferTree,
  Method,
  PatternsByMethod,
  RegistryGroupedByMethod,
  RequestArgs,
  StrKeys,
  TransformApiDefinition,
  TuyauConfiguration,
  TuyauRegistry,
} from './types/types.ts'

/**
 * Main client class for making HTTP requests to AdonisJS endpoints
 * Provides both fluent API and direct method calling capabilities
 *
 * @typeParam Reg - The full registry containing routes and $tree
 * @typeParam Routes - The routes record extracted from the registry
 */
export class Tuyau<
  Reg extends TuyauRegistry,
  Routes extends Record<string, AdonisEndpoint> = InferRoutes<Reg>,
> {
  readonly api: TransformApiDefinition<InferTree<Reg>>
  readonly urlFor: UrlFor<RegistryGroupedByMethod<Routes>>
  readonly #entries: [StrKeys<Routes>, Routes[StrKeys<Routes>]][]
  readonly #client: KyInstance
  readonly #config: TuyauConfiguration<Reg>

  /**
   * Merges the default Ky configuration with user-provided config
   */
  #mergeKyConfiguration() {
    return {
      prefixUrl: this.#config.baseUrl,
      ...this.#config,
      hooks: {
        ...this.#config.hooks,
        beforeRequest: [
          ...(this.#config.hooks?.beforeRequest || []),
          this.#appendCsrfToken.bind(this),
        ],
      },
    }
  }

  /**
   * Applies registered plugins to the client configuration
   */
  #applyPlugins() {
    this.#config.plugins?.forEach((plugin) => plugin({ options: this.#config }))
  }

  /**
   * Creates a URL builder instance for generating URLs based on the route registry
   */
  #createUrlBuilder() {
    const rootEntries = this.#entries.map(([name, entry]) => ({ name, domain: 'root', ...entry }))
    return createUrlBuilder({ root: rootEntries }, buildSearchParams as any)
  }

  /**
   * Initializes the Tuyau client with provided configuration
   */
  constructor(config: TuyauConfiguration<Reg>) {
    this.#config = config
    this.api = this.#makeNamed([])
    this.#entries = Object.entries(this.#config.registry.routes) as [
      StrKeys<Routes>,
      Routes[StrKeys<Routes>],
    ][]
    this.urlFor = this.#createUrlBuilder()

    this.#applyPlugins()

    this.#client = ky.create(this.#mergeKyConfiguration())
  }

  /**
   * Automatically appends CSRF token from cookies to requests
   */
  #appendCsrfToken(request: Request) {
    const cookies = globalThis.document?.cookie
    if (!cookies) return

    const tokenMatch = cookies.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
    const token = tokenMatch?.[1]
    if (!token) return

    try {
      request.headers.set('X-XSRF-TOKEN', decodeURIComponent(token))
    } catch {}
  }

  /**
   * Checks if a value represents a file for upload
   */
  #isFile(v: any) {
    if (isReactNative && isObject(v) && v.uri) return true
    if (isServer) return v instanceof Blob

    return v instanceof FileList || v instanceof File
  }

  /**
   * Checks if an object contains any file uploads
   */
  #hasFile(obj: Record<string, any>) {
    if (!obj) return false

    return Object.values(obj).some((val) => {
      if (Array.isArray(val)) return val.some(this.#isFile)
      return this.#isFile(val)
    })
  }

  #getLowercaseMethod(method: Method) {
    return method.toLowerCase() as Lowercase<Method>
  }

  #buildUrl(name: string, method: Method, args?: RequestArgs<any>): string {
    const lowercaseMethod = this.#getLowercaseMethod(method)
    const usedMethod =
      lowercaseMethod === 'head' || lowercaseMethod === 'options' ? 'get' : lowercaseMethod

    // @ts-expect-error ignore
    return this.urlFor[usedMethod](name, args?.params || {}).url
  }

  /**
   * Performs the actual HTTP request with proper body formatting
   */
  async #doFetch(name: string, method: Method, args: RequestArgs<any>) {
    const url = this.#buildUrl(name, method, args)

    /**
     * If the body has a file, then we should move to multipart form data.
     */
    let key = 'json'
    let body = (args as any).body
    if (!(body instanceof FormData) && this.#hasFile(body)) {
      body = serialize(body, { indices: true })
      key = 'body'
    } else if (body instanceof FormData) {
      key = 'body'
    }

    /**
     * Make the request
     */
    const isGetOrHead = ['GET', 'HEAD'].includes(method)
    const { body: _, responseType: requestedResponseType, ...restArgs } = args as any
    const requestOptions = {
      searchParams: buildSearchParams((args as any)?.query || {}),
      [key]: !isGetOrHead ? body : undefined,
      ...restArgs,
    }

    try {
      // @ts-expect-error tkt
      const res = await this.#client[this.#getLowercaseMethod(method)](
        removeSlash(url),
        requestOptions,
      )

      let data: any

      /**
       * Parse the response based on the explicit responseType or the content type
       */
      if (requestedResponseType) {
        data = await res[requestedResponseType]()
      } else {
        const contentType = res.headers.get('Content-Type')?.split(';')[0]?.trim()
        if (contentType === 'application/json') data = await res.json()
        else if (contentType === 'application/octet-stream') data = await res.arrayBuffer()
        else data = await res.text()
      }

      return data
    } catch (originalError: any) {
      if (originalError instanceof HTTPError) {
        const parsedResponse = await parseResponse(originalError.response)
        throw new TuyauHTTPError(originalError, parsedResponse)
      }

      throw new TuyauNetworkError(originalError, { url, method })
    }
  }

  /**
   * Finds an endpoint definition by HTTP method and pattern
   */
  #byMethodPath(method: Method, pattern: string) {
    const [name, endpoint] = this.#entries.find(
      ([, e]) => e.methods[0] === method && e.pattern === pattern,
    ) || [null, null]

    if (!name || !endpoint) throw new Error(`No ${method} ${pattern}`)

    return { name, endpoint }
  }

  /**
   * Makes a request to a specific endpoint using method and pattern
   */
  #request(method: Method, pattern: string, args: any) {
    const { name, endpoint } = this.#byMethodPath(method, pattern)

    return this.#doFetch(name, endpoint.methods[0], args)
  }

  /**
   * Makes a GET request to the specified pattern
   */
  get<P extends PatternsByMethod<Routes, 'GET'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<Routes, 'GET', P>>,
  ): Promise<EndpointByMethodPattern<Routes, 'GET', P>['types']['response']> {
    return this.#request('GET', pattern, args)
  }

  /**
   * Makes a POST request to the specified pattern
   */
  post<P extends PatternsByMethod<Routes, 'POST'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<Routes, 'POST', P>>,
  ): Promise<EndpointByMethodPattern<Routes, 'POST', P>['types']['response']> {
    return this.#request('POST', pattern, args)
  }

  /**
   * Makes a PUT request to the specified pattern
   */
  put<P extends PatternsByMethod<Routes, 'PUT'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<Routes, 'PUT', P>>,
  ): Promise<EndpointByMethodPattern<Routes, 'PUT', P>['types']['response']> {
    return this.#request('PUT', pattern, args)
  }

  /**
   * Makes a PATCH request to the specified pattern
   */
  patch<P extends PatternsByMethod<Routes, 'PATCH'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<Routes, 'PATCH', P>>,
  ): Promise<EndpointByMethodPattern<Routes, 'PATCH', P>['types']['response']> {
    return this.#request('PATCH', pattern, args)
  }

  /**
   * Makes a DELETE request to the specified pattern
   */
  delete<P extends PatternsByMethod<Routes, 'DELETE'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<Routes, 'DELETE', P>>,
  ): Promise<EndpointByMethodPattern<Routes, 'DELETE', P>['types']['response']> {
    return this.#request('DELETE', pattern, args)
  }

  /**
   * Makes a HEAD request to the specified pattern
   */
  head<P extends PatternsByMethod<Routes, 'HEAD'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<Routes, 'HEAD', P>>,
  ): Promise<EndpointByMethodPattern<Routes, 'HEAD', P>['types']['response']> {
    return this.#request('HEAD', pattern, args)
  }

  /**
   * Makes a request to a named endpoint
   */
  request<Name extends StrKeys<Routes>>(
    name: Name,
    args: RequestArgs<Routes[Name]>,
  ): Promise<Routes[Name]['types']['response']> {
    const def = this.#config.registry.routes[name]
    return this.#doFetch(name, def.methods[0], args)
  }

  /**
   * Gets route information by name including URL and HTTP method
   */
  getRoute<Name extends StrKeys<Routes>>(name: Name, args: RequestArgs<Routes[Name]>) {
    const def = this.#config.registry.routes[name]
    if (!def) throw new Error(`Route ${String(name)} not found`)

    const url = this.#buildUrl(name, def.methods[0], args)
    return { url, methods: def.methods }
  }

  /**
   * Creates a proxy-based fluent API for accessing endpoints by name
   */
  #makeNamed(segments: string[]): any {
    let routeName = segmentsToRouteName(segments)
    let def = this.#config.registry.routes[routeName]

    // Fallback to kebab-case if not found
    if (!def) {
      routeName = segmentsToKebabRouteName(segments)
      def = this.#config.registry.routes[routeName]
    }

    if (def) {
      const fn = (args: any) => this.#doFetch(routeName, def.methods[0], args)
      return new Proxy(fn, {
        get: (_t, prop) => this.#makeNamed([...segments, String(prop)]),
        apply: (_t, _this, argArray) => fn(...(argArray as [any])),
      })
    }
    return new Proxy({}, { get: (_t, prop) => this.#makeNamed([...segments, String(prop)]) })
  }
}

/**
 * Factory function to create a new Tuyau client instance
 */
export function createTuyau<Reg extends TuyauRegistry>(config: TuyauConfiguration<Reg>) {
  return new Tuyau<Reg>(config)
}
