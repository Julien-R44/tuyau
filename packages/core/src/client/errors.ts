import { HTTPError, type KyRequest, type KyResponse } from 'ky'

import { KnownStatuses } from './types/types.ts'

type ErrorForStatus<E, S extends number> = [Extract<E, { status: S }>] extends [never]
  ? { response: unknown }
  : Extract<E, { status: S }>

/**
 * Base class for all errors exposed by Tuyau.
 *
 * `isStatus()` can be used to narrow HTTP errors to a specific typed response payload.
 */
export class TuyauError<E extends { response: any } = { response: any }> extends Error {
  /**
   * Error kind exposed by Tuyau.
   * - `'http'`: the server responded with a non-2xx status code.
   * - `'network'`: a network failure prevented the request from completing.
   * - `'timeout'`: Ky's request or total timeout expired.
   * - `'aborted'`: the request was cancelled by the caller.
   * - `'unknown'`: another error occurred, including parsing and hook errors.
   */
  kind: 'http' | 'network' | 'timeout' | 'aborted' | 'unknown' = 'unknown'

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
   * May be `undefined` even for HTTP errors when the body is empty or cannot be parsed.
   * Typed payloads require a status guard; an unexpected status has an unknown payload.
   */
  response: unknown extends E['response'] ? E['response'] : unknown

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
  ): this is TuyauHTTPError<ErrorForStatus<E, S>> {
    return this.kind === 'http' && this.status === status
  }

  /**
   * Type guard that narrows to a 422 validation error.
   * Alias for `isStatus(422)`.
   */
  isValidationError(): this is TuyauHTTPError<ErrorForStatus<E, 422>> {
    return this.isStatus(422)
  }

  /**
   * Checks payload presence, not its schema. Falsy values, including `null`, are present.
   */
  hasResponse(): this is this & { response: {} | null } {
    return this.response !== undefined
  }
}

export class TuyauHTTPError<E extends { response: any } = { response: any }> extends TuyauError<E> {
  declare kind: 'http'
  declare status: number
  declare rawResponse: KyResponse
  declare rawRequest: KyRequest
  declare response: E['response'] | undefined

  constructor(kyError: HTTPError, url: string) {
    const message = `Request failed with status code ${kyError.response.status}: ${kyError.request.method.toUpperCase()} ${url}`

    super(message, { cause: kyError })

    this.kind = 'http'
    this.rawResponse = kyError.response
    this.response = kyError.data
    this.status = kyError.response.status
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

export class TuyauTimeoutError extends TuyauError<{ response: never }> {
  declare kind: 'timeout'
  declare response: undefined

  constructor(cause: Error) {
    super('Request timed out', { cause })
    this.kind = 'timeout'
    this.name = 'TuyauTimeoutError'
  }
}

export class TuyauAbortedError extends TuyauError<{ response: never }> {
  declare kind: 'aborted'
  declare response: undefined

  constructor(cause: unknown) {
    super('Request aborted', { cause })
    this.kind = 'aborted'
    this.name = 'TuyauAbortedError'
  }
}

export class TuyauUnknownError extends TuyauError<{ response: never }> {
  declare kind: 'unknown'
  declare response: undefined

  constructor(cause: unknown) {
    super('Request failed with an unknown error', { cause })
    this.kind = 'unknown'
    this.name = 'TuyauUnknownError'
  }
}
