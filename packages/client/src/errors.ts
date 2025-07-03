import { KyResponse } from 'ky'

/**
 * TODO: MAJOR
 * TuyauHTTPError should accept a `request` and `response` object
 */
export class TuyauHTTPError extends Error {
  constructor(
    public status: number,
    public value: unknown,
    response?: KyResponse<any>,
    request?: { url: string; method: string },
    cause?: Error,
  ) {
    const reason = status ? `status code ${status}` : 'an unknown error'
    const message = response
      ? `Request failed with ${reason}: ${request?.method.toUpperCase()} /${request?.url}`
      : `Request failed with ${reason}`

    super(message, { cause })

    this.name = 'TuyauHTTPError'
    this.value = value
  }
}

/**
 * Network error that occurs when the server is unreachable or the client is offline
 
 */
export class TuyauNetworkError extends Error {
  constructor(
    public cause: Error,
    request?: { url: string; method: string },
  ) {
    const message = request
      ? `Network error: ${request.method.toUpperCase()} ${request.url}`
      : 'Network error occurred'

    super(message, { cause })
    this.name = 'TuyauNetworkError'
  }
}
