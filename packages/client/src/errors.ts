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
  ) {
    const reason = status ? `status code ${status}` : 'an unknown error'
    const message = response
      ? `Request failed with ${reason}: ${request?.method.toUpperCase()} /${request?.url}`
      : `Request failed with ${reason}`

    super(message)

    this.name = 'TuyauHTTPError'
    this.value = value
  }
}
