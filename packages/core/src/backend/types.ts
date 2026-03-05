/**
 * Extending the HTTP response interface to include status and response
 * in the return type.
 *
 * This is ONLY type information and the properties will not be available
 * at runtime. This is needed to infer the correct response type
 */
import '@adonisjs/core/http'

declare module '@adonisjs/core/http' {
  interface HttpResponse {
    continue(): { __status: 100 }
    switchingProtocols(etag?: boolean): { __status: 101 }
    ok<T>(body: T, etag?: boolean): { __response: T; __status: 200 }
    created<T>(body?: T, etag?: boolean): { __response: T; __status: 201 }
    accepted<T>(body: T, etag?: boolean): { __response: T; __status: 202 }
    nonAuthoritativeInformation<T>(body?: T, etag?: boolean): { __response: T; __status: 203 }
    noContent<T>(body?: T, etag?: boolean): { __response: T; __status: 204 }
    resetContent<T>(body?: T, etag?: boolean): { __response: T; __status: 205 }
    partialContent<T>(body: T, etag?: boolean): { __response: T; __status: 206 }
    multipleChoices<T>(body?: T, etag?: boolean): { __response: T; __status: 300 }
    movedPermanently<T>(body?: T, etag?: boolean): { __response: T; __status: 301 }
    movedTemporarily<T>(body?: T, etag?: boolean): { __response: T; __status: 302 }
    seeOther<T>(body?: T, etag?: boolean): { __response: T; __status: 303 }
    notModified<T>(body?: T, etag?: boolean): { __response: T; __status: 304 }
    useProxy<T>(body?: T, etag?: boolean): { __response: T; __status: 305 }
    temporaryRedirect<T>(body?: T, etag?: boolean): { __response: T; __status: 307 }
    badRequest<T>(body?: T, etag?: boolean): { __response: T; __status: 400 }
    unauthorized<T>(body?: T, etag?: boolean): { __response: T; __status: 401 }
    paymentRequired<T>(body?: T, etag?: boolean): { __response: T; __status: 402 }
    forbidden<T>(body?: T, etag?: boolean): { __response: T; __status: 403 }
    notFound<T>(body?: T, etag?: boolean): { __response: T; __status: 404 }
    methodNotAllowed<T>(body?: T, etag?: boolean): { __response: T; __status: 405 }
    notAcceptable<T>(body?: T, etag?: boolean): { __response: T; __status: 406 }
    proxyAuthenticationRequired<T>(body?: T, etag?: boolean): { __response: T; __status: 407 }
    requestTimeout<T>(body?: T, etag?: boolean): { __response: T; __status: 408 }
    conflict<T>(body?: T, etag?: boolean): { __response: T; __status: 409 }
    gone<T>(body?: T, etag?: boolean): { __response: T; __status: 410 }
    lengthRequired<T>(body?: T, etag?: boolean): { __response: T; __status: 411 }
    preconditionFailed<T>(body?: T, etag?: boolean): { __response: T; __status: 412 }
    requestEntityTooLarge<T>(body?: T, etag?: boolean): { __response: T; __status: 413 }
    requestUriTooLong<T>(body?: T, etag?: boolean): { __response: T; __status: 414 }
    unsupportedMediaType<T>(body?: T, etag?: boolean): { __response: T; __status: 415 }
    requestedRangeNotSatisfiable<T>(body?: T, etag?: boolean): { __response: T; __status: 416 }
    expectationFailed<T>(body?: T, etag?: boolean): { __response: T; __status: 417 }
    unprocessableEntity<T>(body?: T, etag?: boolean): { __response: T; __status: 422 }
    tooManyRequests<T>(body?: T, etag?: boolean): { __response: T; __status: 429 }
    internalServerError<T>(body?: T, etag?: boolean): { __response: T; __status: 500 }
    notImplemented<T>(body?: T, etag?: boolean): { __response: T; __status: 501 }
    badGateway<T>(body?: T, etag?: boolean): { __response: T; __status: 502 }
    serviceUnavailable<T>(body?: T, etag?: boolean): { __response: T; __status: 503 }
    gatewayTimeout<T>(body?: T, etag?: boolean): { __response: T; __status: 504 }
    httpVersionNotSupported<T>(body?: T, etag?: boolean): { __response: T; __status: 505 }
    json<T>(body: T, generateEtag?: boolean): { __response: T; __status: 200 }
  }
}

export interface GenerateRegistryConfig {
  /**
   * Path to write the generated registry directory
   * @default ./.adonisjs/client/registry
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

  /**
   * Custom TypeScript type string for 422 validation error responses.
   * When not provided, uses the default VineJS SimpleErrorReporter format.
   * Set to `false` to disable auto-adding 422 errors.
   */
  validationErrorType?: string | false
}
