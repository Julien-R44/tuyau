import { Tuyau } from '@tuyau/core/client'

/**
 * Captured request information
 */
export interface CapturedRequest {
  routeName: string
  options: Record<string, any>
}

/**
 * Helper class to inspect captured requests in tests
 */
export class RequestCapture {
  #requests: CapturedRequest[] = []

  push(request: CapturedRequest) {
    this.#requests.push(request)
  }

  /**
   * Get the last captured request
   */
  getLastRequest(): CapturedRequest | undefined {
    return this.#requests.at(-1)
  }

  /**
   * Get all captured requests
   */
  all(): CapturedRequest[] {
    return this.#requests
  }

  /**
   * Get a request by index
   */
  get(index: number): CapturedRequest | undefined {
    return this.#requests[index]
  }

  /**
   * Get the number of captured requests
   */
  count(): number {
    return this.#requests.length
  }

  /**
   * Clear all captured requests
   */
  clear() {
    this.#requests = []
  }
}

/**
 * Wrap a Tuyau client to capture all requests made through it.
 * Useful for testing that correct options are passed to the client.
 */
export function withRequestCapture<T extends Tuyau<any>>(client: T) {
  const capture = new RequestCapture()

  const originalRequest = client.request.bind(client)
  client.request = async (routeName: string, opts?: any) => {
    capture.push({ routeName, options: opts || {} })
    return originalRequest(routeName as any, opts)
  }

  return { client, capture }
}
