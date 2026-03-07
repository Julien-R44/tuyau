import { skipToken } from '@tanstack/query-core'
import type { QueryFunctionContext, SkipToken } from '@tanstack/query-core'
import { Tuyau } from '@tuyau/core/client'
import type { RawRequestArgs } from '@tuyau/core/types'

import { invoke, extractKyOptions, isObject } from './utils.ts'
import type { TuyauRequestOptions } from './types.ts'

/**
 * Internal options for building an infinite query function.
 * The `opts` parameter accepts any object with optional `tuyau` and
 * `pageParamKey` properties — this avoids coupling to framework-specific
 * option types (React vs Vue) while still accessing the needed values
 */
export interface CreateInfiniteQueryFnOptions {
  request: RawRequestArgs<any> | SkipToken
  opts?: { tuyau?: TuyauRequestOptions; pageParamKey?: string; [key: string]: any }
  routeName: string
  client: Tuyau<any>
  globalOptions?: TuyauRequestOptions
}

/**
 * Creates a TanStack Query `queryFn` for infinite queries.
 * Injects the page parameter into the request query using the
 * configured `pageParamKey` (defaults to `'page'`).
 * Returns `skipToken` when the request is a skip token.
 * Ky retries are disabled (retry: 0) to let TanStack Query handle retries
 */
export function createInfiniteQueryFn(options: CreateInfiniteQueryFnOptions) {
  const { request, routeName, opts, client, globalOptions } = options

  return invoke(() => {
    if (request === skipToken) return skipToken

    return async (queryFnContext: QueryFunctionContext) => {
      const { pageParam } = queryFnContext
      const effectiveAbortOnUnmount =
        opts?.tuyau?.abortOnUnmount ?? globalOptions?.abortOnUnmount ?? false

      const kyOptions = extractKyOptions(opts?.tuyau)
      const pageParamKey = opts?.pageParamKey || 'page'
      let requestArgs: RawRequestArgs<any>

      if (isObject(request)) {
        if (pageParam !== undefined) {
          requestArgs = {
            ...request,
            query: { ...(request as any).query, [pageParamKey]: pageParam },
          }
        } else {
          requestArgs = request
        }
      } else {
        requestArgs = { query: pageParam !== undefined ? { [pageParamKey]: pageParam } : {} }
      }

      return await client.request(routeName, {
        ...requestArgs,
        ...kyOptions,
        retry: 0,
        ...(effectiveAbortOnUnmount ? { signal: queryFnContext.signal } : {}),
      })
    }
  })
}
