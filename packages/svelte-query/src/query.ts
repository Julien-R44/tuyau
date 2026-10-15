import { createQueryFn } from '@tuyau/query-core'
import type { CreateQueryFnOptions, TuyauQueryKey } from '@tuyau/query-core'
import type { CreateQueryOptions } from '@tanstack/svelte-query'

/**
 * Internal options for building a TanStack Query options object
 */
export type TuyauQueryOptionsOptions = CreateQueryFnOptions & { queryKey: TuyauQueryKey }

/**
 * Builds a TanStack Svelte Query `queryOptions` object from Tuyau route information.
 * Delegates queryFn creation to the shared `createQueryFn` from `@tuyau/query-core`.
 *
 * @tanstack/svelte-query's barrel export re-exports .svelte component files
 * (HydrationBoundary, QueryClientProvider) which Node.js cannot load without
 * a Svelte compiler. Since `queryOptions` is a pure identity function (it just
 * returns its input for type inference), we construct the result directly
 */
export function tuyauQueryOptions(
  options: TuyauQueryOptionsOptions,
): CreateQueryOptions & { queryKey: TuyauQueryKey } {
  const { queryKey, ...fnOptions } = options
  const queryFn = createQueryFn(fnOptions)
  return { ...options.opts, queryKey, queryFn } as any
}
