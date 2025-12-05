import { HTTPError, type KyRequest, type KyResponse } from 'ky'

export async function parseResponse(response?: KyResponse) {
  if (!response) return

  const responseType = response.headers.get('Content-Type')?.split(';')[0]
  if (responseType === 'application/json') {
    return await response.json()
  } else if (responseType === 'application/octet-stream') {
    return await response.arrayBuffer()
  }

  return await response.text()
}

export class TuyauHTTPError extends Error {
  status: number | undefined
  rawResponse: KyResponse | undefined
  rawRequest: KyRequest | undefined
  response: any

  constructor(kyError: HTTPError, response: any) {
    const status = kyError.response?.status
    const reason = status ? `status code ${status}` : 'an unknown error'
    const url = kyError.request?.url.replace(kyError.options.prefixUrl || '', '')

    const message = kyError.response
      ? `Request failed with ${reason}: ${kyError.request?.method.toUpperCase()} /${url}`
      : `Request failed with ${reason}`

    super(message, { cause: kyError })

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
export class TuyauNetworkError extends Error {
  cause: Error
  constructor(cause: Error, request?: { url: string; method: string }) {
    const message = request
      ? `Network error: ${request.method.toUpperCase()} ${request.url}`
      : 'Network error occurred'

    super(message, { cause })
    this.cause = cause
    this.name = 'TuyauNetworkError'
  }
}
