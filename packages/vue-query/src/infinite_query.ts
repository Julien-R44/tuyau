import { Tuyau } from '@tuyau/core/client'
import { infiniteQueryOptions } from '@tanstack/vue-query'
import { createInfiniteQueryFn } from '@tuyau/query-core'
import type { TuyauQueryKey, TuyauRequestOptions } from '@tuyau/query-core'
import type { SkipToken } from '@tanstack/query-core'
import type { RawRequestArgs } from '@tuyau/core/types'

import type { AnyTuyauInfiniteQueryOptionsIn } from './types/common.ts'

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
 * Builds a TanStack Vue Query `infiniteQueryOptions` object from Tuyau route information.
 * Delegates queryFn creation to the shared `createInfiniteQueryFn` from `@tuyau/query-core`.
 *
 * Uses `as Record<string, any>` internally to work around Vue Query's
 * MaybeRef type wrapping which prevents direct property access
 */
export function tuyauInfiniteQueryOptions(options: TuyauInfiniteQueryOptionsOptions) {
  const { request, routeName, opts, queryKey, client, globalOptions } = options
  const resolvedOpts = opts as Record<string, any> | undefined

  const queryFn = createInfiniteQueryFn({
    request,
    routeName,
    opts: resolvedOpts,
    client,
    globalOptions,
  })

  return infiniteQueryOptions({
    ...resolvedOpts,
    queryKey,
    queryFn,

    initialPageParam: resolvedOpts?.initialPageParam ?? 1,
    getNextPageParam: resolvedOpts?.getNextPageParam ?? (() => null),
    getPreviousPageParam: resolvedOpts?.getPreviousPageParam,
  } as any)
}
