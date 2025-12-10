import { Tuyau } from '@tuyau/core/client'
import type { RawRequestArgs } from '@tuyau/core/types'
import { infiniteQueryOptions, skipToken } from '@tanstack/react-query'
import type { QueryFunctionContext, SkipToken } from '@tanstack/react-query'

import { invoke } from './utils.ts'
import type { TuyauInfiniteQueryOptionsIn } from './types/infinite_query.ts'
import type { TuyauQueryKey, TuyauReactRequestOptions } from './types/common.ts'

interface TuyauInfiniteQueryOptionsOptions {
  request: RawRequestArgs<any> | SkipToken
  opts?: TuyauInfiniteQueryOptionsIn<any, any, any>
  queryKey: TuyauQueryKey
  routeName: string
  client: Tuyau<any>
  globalOptions?: TuyauReactRequestOptions
}

export function tuyauInfiniteQueryOptions(options: TuyauInfiniteQueryOptionsOptions) {
  const { request, routeName, opts, queryKey, client, globalOptions } = options

  const queryFn = invoke(() => {
    if (request === skipToken) return skipToken

    return async (queryFnContext: QueryFunctionContext) => {
      const { pageParam } = queryFnContext
      const effectiveAbortOnUnmount =
        opts?.tuyau?.abortOnUnmount ?? globalOptions?.abortOnUnmount ?? false

      const pageParamKey = opts?.pageParamKey || 'page'
      let requestArgs: RawRequestArgs<any>

      if (typeof request === 'object' && request !== null) {
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
        retry: 0,
        ...(effectiveAbortOnUnmount ? { signal: queryFnContext.signal } : {}),
      })
    }
  })

  return infiniteQueryOptions({
    ...opts,
    queryKey,
    queryFn,

    initialPageParam: opts?.initialPageParam ?? 1,
    getNextPageParam: opts?.getNextPageParam ?? (() => null),
    getPreviousPageParam: opts?.getPreviousPageParam,
  })
}
