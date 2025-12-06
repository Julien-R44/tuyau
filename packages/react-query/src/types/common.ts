import type { AdonisEndpoint, RawRequestArgs } from '@tuyau/core/types'
import type {
  DataTag,
  DefinedInitialDataOptions,
  QueryFilters,
  UndefinedInitialDataOptions,
  UnusedSkipTokenOptions,
} from '@tanstack/react-query'

import type { DecorateQueryFn } from './query.ts'
import type { DecorateMutationFn } from '../mutation.ts'
import type { DistributiveOmit, WithRequired } from './utils.ts'
import type { DecorateInfiniteQueryFn } from './infinite_query.ts'

/**
 * Query type identifier
 */
export type QueryType = 'any' | 'infinite' | 'query'

/**
 * Tuyau-specific query key structure
 */
export type TuyauQueryKey = [
  readonly string[],
  { request?: RawRequestArgs<any>; type?: Exclude<QueryType, 'any'> }?,
]

/**
 * Tuyau-specific mutation key structure
 */
export type TuyauMutationKey = [readonly string[]]

/**
 * Query options with defined initial data
 */
export interface DefinedTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends DistributiveOmit<
      DefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
      'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
    >,
    TuyauQueryBaseOptions {}

/**
 * Query options with undefined initial data
 */
export interface UndefinedTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends DistributiveOmit<
      UndefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
      'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
    >,
    TuyauQueryBaseOptions {}

/**
 * Query options with unused skip token
 */
export interface UnusedSkipTokenTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends DistributiveOmit<
      UnusedSkipTokenOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
      'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
    >,
    TuyauQueryBaseOptions {}

/**
 * Output type for query options with defined initial data
 */
export interface DefinedTuyauQueryOptionsOut<TQueryFnData, TData, TError>
  extends DefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey> {
  queryKey: DataTag<TuyauQueryKey, TData, TError>
}

/**
 * Output type for query options with undefined initial data
 */
export interface UndefinedTuyauQueryOptionsOut<TQueryFnData, TData, TError>
  extends UndefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey> {
  queryKey: DataTag<TuyauQueryKey, TData, TError>
}

/**
 * Output type for query options with unused skip token
 */
export interface UnusedSkipTokenTuyauQueryOptionsOut<TQueryFnData, TData, TError>
  extends UnusedSkipTokenOptions<TQueryFnData, TError, TData, TuyauQueryKey> {
  queryKey: DataTag<TuyauQueryKey, TData, TError>
}

/**
 * Tuyau-specific request options for React Query integration
 */
export interface TuyauReactRequestOptions {
  /**
   * Opt out or into aborting request on unmount
   */
  abortOnUnmount?: boolean
}

/**
 * Base options for Tuyau queries
 */
export interface TuyauQueryBaseOptions {
  tuyau?: TuyauReactRequestOptions
}

export interface DecorateRouterKeyable {
  pathKey: () => TuyauQueryKey
  pathFilter: (
    filters?: QueryFilters<TuyauQueryKey>,
  ) => WithRequired<QueryFilters<TuyauQueryKey>, 'queryKey'>
}

/**
 * Determines if endpoint is a query (GET/HEAD) or mutation
 */
type IsQueryMethod<E extends AdonisEndpoint> = E['methods'] extends readonly (infer M)[]
  ? M extends 'GET' | 'HEAD'
    ? true
    : false
  : false

/**
 * Endpoint node with query or mutation decorators
 * Optimized: uses direct conditional instead of nested extends
 */
export type EndpointNode<E extends AdonisEndpoint> = (IsQueryMethod<E> extends true
  ? DecorateQueryFn<E> & DecorateInfiniteQueryFn<E>
  : DecorateMutationFn<E>) &
  DecorateRouterKeyable

/**
 * Transform a pre-computed tree structure into react-query decorated endpoints
 * Uses the $tree from the registry to avoid recomputing the structure
 * Handles the case where a node is both an endpoint AND has children
 */
export type TransformToReactQuery<T> = {
  [K in keyof T]: T[K] extends AdonisEndpoint
    ? EndpointNode<T[K]> & TransformToReactQuery<Omit<T[K], keyof AdonisEndpoint>>
    : TransformToReactQuery<T[K]>
} & DecorateRouterKeyable

export type TuyauReactQuery<R extends Record<string, AdonisEndpoint>> = TransformToReactQuery<R>
