import ky, { HTTPError, KyInstance } from 'ky'
import { serialize } from 'object-to-formdata'
import { createUrlBuilder, UrlFor } from '@adonisjs/http-server/client/url_builder'

import { parseResponse, TuyauHTTPError, TuyauNetworkError } from './errors.ts'
import { buildSearchParams, isObject, isReactNative, isServer, removeSlash } from './utils.ts'
import type {
  AdonisEndpoint,
  BuildNamed,
  EndpointByMethodPattern,
  Method,
  PatternsByMethod,
  RegistryGroupedByMethod,
  RequestArgs,
  StrKeys,
  TuyauConfiguration,
} from './types/types.ts'

/**
 * Main client class for making HTTP requests to AdonisJS endpoints
 * Provides both fluent API and direct method calling capabilities
 */
export class Tuyau<R extends Record<string, AdonisEndpoint>> {
  readonly api: BuildNamed<R>
  readonly urlFor: UrlFor<RegistryGroupedByMethod<R>>
  readonly #entries: [StrKeys<R>, R[StrKeys<R>]][]
  readonly #client: KyInstance

  /**
   * Merges the default Ky configuration with user-provided config
   */
  #mergeKyConfiguration() {
    return {
      prefixUrl: this.config.baseUrl,
      ...this.config,
      hooks: {
        ...this.config.hooks,
        beforeRequest: [
          ...(this.config.hooks?.beforeRequest || []),
          this.#appendCsrfToken.bind(this),
        ],
      },
    }
  }

  /**
   * Applies registered plugins to the client configuration
   */
  #applyPlugins() {
    this.config.plugins?.forEach((plugin) => plugin({ options: this.config }))
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
  constructor(private config: TuyauConfiguration<R>) {
    this.api = this.makeNamed([])
    this.#entries = Object.entries(this.config.registry) as [StrKeys<R>, R[StrKeys<R>]][]
    this.urlFor = this.#createUrlBuilder()

    this.#applyPlugins()

    this.#client = ky.create(this.#mergeKyConfiguration())
  }

  /**
   * Automatically appends CSRF token from cookies to requests
   */
  #appendCsrfToken(request: Request) {
    const xCsrfToken = globalThis.document?.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))

    if (!xCsrfToken) return

    request.headers.set('X-XSRF-TOKEN', decodeURIComponent(xCsrfToken.split('=')[1]))
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
    const { body: _, ...restArgs } = args as any
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
       * Parse the response based on the content type
       */
      const responseType = res.headers.get('Content-Type')?.split(';')[0]
      if (responseType === 'application/json') {
        data = await res.json()
      } else if (responseType === 'application/octet-stream') {
        data = await res.arrayBuffer()
      } else {
        data = await res.text()
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
  get<P extends PatternsByMethod<R, 'GET'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<R, 'GET', P>>,
  ): Promise<EndpointByMethodPattern<R, 'GET', P>['types']['response']> {
    return this.#request('GET', pattern, args)
  }

  /**
   * Makes a POST request to the specified pattern
   */
  post<P extends PatternsByMethod<R, 'POST'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<R, 'POST', P>>,
  ): Promise<EndpointByMethodPattern<R, 'POST', P>['types']['response']> {
    return this.#request('POST', pattern, args)
  }

  /**
   * Makes a PUT request to the specified pattern
   */
  put<P extends PatternsByMethod<R, 'PUT'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<R, 'PUT', P>>,
  ): Promise<EndpointByMethodPattern<R, 'PUT', P>['types']['response']> {
    return this.#request('PUT', pattern, args)
  }

  /**
   * Makes a PATCH request to the specified pattern
   */
  patch<P extends PatternsByMethod<R, 'PATCH'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<R, 'PATCH', P>>,
  ): Promise<EndpointByMethodPattern<R, 'PATCH', P>['types']['response']> {
    return this.#request('PATCH', pattern, args)
  }

  /**
   * Makes a DELETE request to the specified pattern
   */
  delete<P extends PatternsByMethod<R, 'DELETE'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<R, 'DELETE', P>>,
  ): Promise<EndpointByMethodPattern<R, 'DELETE', P>['types']['response']> {
    return this.#request('DELETE', pattern, args)
  }

  /**
   * Makes a HEAD request to the specified pattern
   */
  head<P extends PatternsByMethod<R, 'HEAD'>>(
    pattern: P,
    args: RequestArgs<EndpointByMethodPattern<R, 'HEAD', P>>,
  ): Promise<EndpointByMethodPattern<R, 'HEAD', P>['types']['response']> {
    return this.#request('HEAD', pattern, args)
  }

  /**
   * Makes a request to a named endpoint
   */
  request<Name extends StrKeys<R>>(
    name: Name,
    args: RequestArgs<R[Name]>,
  ): Promise<R[Name]['types']['response']> {
    const def = this.config.registry[name]
    return this.#doFetch(name, def.methods[0], args)
  }

  /**
   * Gets route information by name including URL and HTTP method
   */
  getRoute<Name extends StrKeys<R>>(name: Name, args: RequestArgs<R[Name]>) {
    const def = this.config.registry[name]
    if (!def) throw new Error(`Route ${String(name)} not found`)

    const url = this.#buildUrl(name, def.methods[0], args)
    return { url, methods: def.methods }
  }

  /**
   * Creates a proxy-based fluent API for accessing endpoints by name
   */
  private makeNamed(segments: string[]): any {
    const dot = segments.join('.')

    const def = this.config.registry[dot]
    if (def) {
      const fn = (args: any) => this.#doFetch(dot, def.methods[0], args)
      return new Proxy(fn, {
        get: (_t, prop) => this.makeNamed([...segments, String(prop)]),
        apply: (_t, _this, argArray) => fn(...(argArray as [any])),
      })
    }
    return new Proxy({}, { get: (_t, prop) => this.makeNamed([...segments, String(prop)]) })
  }
}

/**
 * Factory function to create a new Tuyau client instance
 */
export function createTuyau<R extends Record<string, AdonisEndpoint>>(
  config: TuyauConfiguration<R>,
) {
  return new Tuyau(config)
}
