import { queryOptions } from '@tanstack/vue-query'
import { createQueryFn } from '@tuyau/query-core'
import type { CreateQueryFnOptions, TuyauQueryKey } from '@tuyau/query-core'

/**
 * Internal options for building a TanStack Query options object
 */
export type TuyauQueryOptionsOptions = CreateQueryFnOptions & { queryKey: TuyauQueryKey }

/**
 * Builds a TanStack Vue Query `queryOptions` object from Tuyau route information.
 * Delegates queryFn creation to the shared `createQueryFn` from `@tuyau/query-core`
 */
export function tuyauQueryOptions(options: TuyauQueryOptionsOptions) {
  const { queryKey, ...fnOptions } = options
  const queryFn = createQueryFn(fnOptions)
  return queryOptions({ ...options.opts, queryKey, queryFn })
}
