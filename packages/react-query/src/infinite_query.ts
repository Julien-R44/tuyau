import { Tuyau } from '@tuyau/core/client'
import { infiniteQueryOptions } from '@tanstack/react-query'
import { createInfiniteQueryFn } from '@tuyau/query-core'
import type { TuyauQueryKey, TuyauRequestOptions } from '@tuyau/query-core'
import type { SkipToken } from '@tanstack/react-query'
import type { RawRequestArgs } from '@tuyau/core/types'

import type { AnyTuyauInfiniteQueryOptionsIn } from './types/infinite_query.ts'

/**
 * Internal options for building an infinite query options object
 */
interface TuyauInfiniteQueryOptionsOptions {
  request: RawRequestArgs<any> | SkipToken
  opts?: AnyTuyauInfiniteQueryOptionsIn<any, any, any>
  queryKey: TuyauQueryKey
  routeName: string
  client: Tuyau<any>
  globalOptions?: TuyauRequestOptions
}

/**
 * Builds a TanStack React Query `infiniteQueryOptions` object from Tuyau route information.
 * Delegates queryFn creation to the shared `createInfiniteQueryFn` from `@tuyau/query-core`
 */
export function tuyauInfiniteQueryOptions(options: TuyauInfiniteQueryOptionsOptions) {
  const { request, routeName, opts, queryKey, client, globalOptions } = options

  const queryFn = createInfiniteQueryFn({ request, routeName, opts, client, globalOptions })

  return infiniteQueryOptions({
    ...opts,
    queryKey,
    queryFn,

    initialPageParam: opts?.initialPageParam ?? 1,
    getNextPageParam: opts?.getNextPageParam ?? (() => null),
    getPreviousPageParam: opts?.getPreviousPageParam,
  })
}
