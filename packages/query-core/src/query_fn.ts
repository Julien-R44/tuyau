import { skipToken } from '@tanstack/query-core'
import type { QueryFunctionContext, SkipToken } from '@tanstack/query-core'
import { Tuyau } from '@tuyau/core/client'
import type { RawRequestArgs } from '@tuyau/core/types'

import { invoke, extractKyOptions } from './utils.ts'
import type { TuyauRequestOptions, TuyauQueryBaseOptions } from './types.ts'

/**
 * Internal options for building a query function
 */
export interface CreateQueryFnOptions {
  request: RawRequestArgs<any> | SkipToken
  opts?: TuyauQueryBaseOptions
  routeName: string
  client: Tuyau<any>
  globalOptions?: TuyauRequestOptions
}

/**
 * Creates a TanStack Query `queryFn` from Tuyau route information.
 * Returns `skipToken` when the request is a skip token (conditional queries).
 * Handles abort-on-unmount and Ky options extraction.
 * Ky retries are disabled (retry: 0) to let TanStack Query handle retries
 */
export function createQueryFn(options: CreateQueryFnOptions) {
  const { request, routeName, opts, client, globalOptions } = options

  return invoke(() => {
    if (request === skipToken) return skipToken

    return async (queryFnContext: QueryFunctionContext) => {
      const effectiveAbortOnUnmount =
        opts?.tuyau?.abortOnUnmount ?? globalOptions?.abortOnUnmount ?? false

      const kyOptions = extractKyOptions(opts?.tuyau)

      return await client.request(routeName, {
        ...request,
        ...kyOptions,
        retry: 0,
        ...(effectiveAbortOnUnmount ? { signal: queryFnContext.signal } : {}),
      })
    }
  })
}
