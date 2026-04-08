import { Tuyau } from '@tuyau/core/client'
import { createInfiniteQueryFn } from '@tuyau/query-core'
import type { TuyauQueryKey, TuyauRequestOptions } from '@tuyau/query-core'
import type { SkipToken } from '@tanstack/query-core'
import type { RawRequestArgs } from '@tuyau/core/types'
import type { CreateInfiniteQueryOptions } from '@tanstack/svelte-query'

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
 * Builds a TanStack Svelte Query `infiniteQueryOptions` object from Tuyau route information.
 * Delegates queryFn creation to the shared `createInfiniteQueryFn` from `@tuyau/query-core`.
 *
 * @tanstack/svelte-query's barrel export re-exports .svelte component files
 * (HydrationBoundary, QueryClientProvider) which Node.js cannot load without
 * a Svelte compiler. Since `infiniteQueryOptions` is a pure identity function
 * (it just returns its input for type inference), we construct the result directly
 */
export function tuyauInfiniteQueryOptions(
  options: TuyauInfiniteQueryOptionsOptions,
): CreateInfiniteQueryOptions & { queryKey: TuyauQueryKey } {
  const { request, routeName, opts, queryKey, client, globalOptions } = options

  const queryFn = createInfiniteQueryFn({ request, routeName, opts, client, globalOptions })

  return {
    ...opts,
    queryKey,
    queryFn,

    initialPageParam: opts?.initialPageParam ?? 1,
    getNextPageParam: opts?.getNextPageParam ?? (() => null),
    getPreviousPageParam: opts?.getPreviousPageParam,
  } as any
}
