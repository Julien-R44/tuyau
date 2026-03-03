import { HTTPError, type KyRequest, type KyResponse } from 'ky'

import { KnownStatuses } from './types/types.ts'

/**
 * Base class for all errors exposed by Tuyau.
 *
 * `isStatus()` can be used to narrow HTTP errors to a specific typed response payload.
 */
export class TuyauError<E extends { response: any } = { response: any }> extends Error {
  /**
   * Error kind exposed by Tuyau.
   * - `'http'`: the server responded with a non-2xx status code.
   * - `'network'`: the request failed before receiving a response.
   */
  kind!: 'http' | 'network'

  /**
   * HTTP status code returned by the server.
   * `undefined` when the request failed before a response was received.
   */
  status: number | undefined

  /**
   * Original Ky response object for HTTP errors.
   * `undefined` for network errors.
   */
  rawResponse: KyResponse | undefined

  /**
   * Original Ky request object when available.
   */
  rawRequest: KyRequest | undefined

  /**
   * Parsed error payload returned by the server.
   * `undefined` for network errors.
   */
  response: E['response'] | undefined

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)

    this.status = undefined
    this.response = undefined
    this.rawResponse = undefined
    this.rawRequest = undefined
    this.name = 'TuyauError'
  }

  /**
   * Type guard that narrows the error to a specific HTTP status code.
   * After calling `isStatus(422)`, the `response` property is narrowed
   * to the type associated with that status code.
   */
  isStatus<S extends KnownStatuses<E> | (number & {})>(
    status: S,
  ): this is TuyauHTTPError<Extract<E, { status: S }>> {
    return this.kind === 'http' && this.status === status
  }
}

export class TuyauHTTPError<E extends { response: any } = { response: any }> extends TuyauError<E> {
  declare kind: 'http'
  declare status: number | undefined
  declare rawResponse: KyResponse | undefined
  declare rawRequest: KyRequest | undefined
  declare response: E['response']

  constructor(kyError: HTTPError, response: any) {
    const status = kyError.response?.status
    const reason = status ? `status code ${status}` : 'an unknown error'
    const url = kyError.request?.url.replace(kyError.options.prefixUrl || '', '')

    const message = kyError.response
      ? `Request failed with ${reason}: ${kyError.request?.method.toUpperCase()} /${url}`
      : `Request failed with ${reason}`

    super(message, { cause: kyError })

    this.kind = 'http'
    this.rawResponse = kyError.response
    this.response = response
    this.status = kyError.response?.status
    this.rawRequest = kyError.request
    this.name = 'TuyauHTTPError'
  }
}

/**
 * Network error that occurs when the server is unreachable or the client is offline
 */
export class TuyauNetworkError extends TuyauError<{ response: never }> {
  declare kind: 'network'
  declare status: undefined
  declare rawResponse: undefined
  declare rawRequest: KyRequest | undefined
  declare response: undefined

  constructor(cause: Error, request?: { url: string; method: string }) {
    const message = request
      ? `Network error: ${request.method.toUpperCase()} ${request.url}`
      : 'Network error occurred'

    super(message, { cause })

    this.kind = 'network'
    this.name = 'TuyauNetworkError'
  }
}
