import type { QueryFilters } from '@tanstack/query-core'
import type { BaseRequestOptions, RawRequestArgs } from '@tuyau/core/types'

/**
 * Discriminator for the type of TanStack Query operation.
 * Used in query keys to differentiate between regular queries,
 * infinite queries, and catch-all path filters
 */
export type QueryType = 'any' | 'infinite' | 'query'

/**
 * Structured query key used by Tuyau's TanStack Query integration.
 * First element is the route path segments, second is an optional
 * metadata object containing the request arguments and query type
 */
export type TuyauQueryKey = [
  readonly string[],
  { request?: RawRequestArgs<any>; type?: Exclude<QueryType, 'any'> }?,
]

/**
 * Structured mutation key used by Tuyau's TanStack Query integration.
 * Contains only the route path segments since mutations don't need
 * request-based differentiation
 */
export type TuyauMutationKey = [readonly string[]]

/**
 * Options forwarded to the underlying Ky HTTP client, extended
 * with `abortOnUnmount` to automatically abort requests when
 * the component using the query unmounts
 */
export interface TuyauRequestOptions extends BaseRequestOptions {
  abortOnUnmount?: boolean
}

/**
 * Base options shared by all Tuyau query/mutation option builders.
 * Allows passing Ky-specific options via the `tuyau` property
 */
export interface TuyauQueryBaseOptions {
  tuyau?: TuyauRequestOptions
}

/**
 * Methods available on every node of the Tuyau query client proxy tree.
 * Provides path-level query key and filter generation for cache operations
 * like invalidation or removal across all query types for a given route
 */
export interface DecorateRouterKeyable {
  pathKey: () => TuyauQueryKey
  pathFilter: (
    filters?: QueryFilters<TuyauQueryKey>,
  ) => WithRequired<QueryFilters<TuyauQueryKey>, 'queryKey'>
}

/**
 * Generic function type helper
 */
export type Fn<Result = void, Args extends unknown[] = unknown[]> = (...args: Args) => Result

/**
 * Like `Omit` but distributes over union types.
 * Standard `Omit` collapses unions, this preserves each union member
 */
export type DistributiveOmit<TObj, TKey extends keyof any> = TObj extends any
  ? Omit<TObj, TKey>
  : never

/**
 * Makes specific keys of a type required while keeping the rest unchanged
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>
