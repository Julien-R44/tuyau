import type { SchemaEndpoint } from '@tuyau/core/types'
import type {
  DataTag,
  DefinedInitialDataOptions,
  UndefinedInitialDataOptions,
  UnusedSkipTokenOptions,
} from '@tanstack/react-query'
import type {
  TuyauQueryKey,
  TuyauMutationKey,
  TuyauRequestOptions,
  TuyauQueryBaseOptions,
  DecorateRouterKeyable,
  DistributiveOmit,
} from '@tuyau/query-core'

import type { DecorateQueryFn } from './query.ts'
import type { DecorateMutationFn } from '../mutation.ts'
import type { DecorateInfiniteQueryFn } from './infinite_query.ts'

export type { TuyauQueryKey, TuyauMutationKey, TuyauQueryBaseOptions, DecorateRouterKeyable }
export type { DistributiveOmit, WithRequired } from '@tuyau/query-core'
export type { QueryType } from '@tuyau/query-core'

/**
 * Query options with defined initial data
 */
export interface DefinedTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends
    DistributiveOmit<
      DefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
      'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
    >,
    TuyauQueryBaseOptions {}

/**
 * Query options with undefined initial data
 */
export interface UndefinedTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends
    DistributiveOmit<
      UndefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
      'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
    >,
    TuyauQueryBaseOptions {}

/**
 * Query options with unused skip token
 */
export interface UnusedSkipTokenTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends
    DistributiveOmit<
      UnusedSkipTokenOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
      'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
    >,
    TuyauQueryBaseOptions {}

/**
 * Output type for query options with defined initial data
 */
export interface DefinedTuyauQueryOptionsOut<
  TQueryFnData,
  TData,
  TError,
> extends DefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey> {
  queryKey: DataTag<TuyauQueryKey, TData, TError>
}

/**
 * Output type for query options with undefined initial data
 */
export interface UndefinedTuyauQueryOptionsOut<
  TQueryFnData,
  TData,
  TError,
> extends UndefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey> {
  queryKey: DataTag<TuyauQueryKey, TData, TError>
}

/**
 * Output type for query options with unused skip token
 */
export interface UnusedSkipTokenTuyauQueryOptionsOut<
  TQueryFnData,
  TData,
  TError,
> extends UnusedSkipTokenOptions<TQueryFnData, TError, TData, TuyauQueryKey> {
  queryKey: DataTag<TuyauQueryKey, TData, TError>
}

/**
 * Alias for backward compatibility with existing consumers
 */
export type TuyauReactRequestOptions = TuyauRequestOptions

type EndpointKeys = 'methods' | 'pattern' | 'types'

/**
 * Determines if endpoint is a query (GET/HEAD) or mutation
 */
type IsQueryMethod<E extends SchemaEndpoint> = E['methods'][number] extends infer M
  ? M extends 'GET' | 'HEAD'
    ? true
    : false
  : false

/**
 * Endpoint node with query or mutation decorators
 * Optimized: uses direct conditional instead of nested extends
 */
export type EndpointNode<E extends SchemaEndpoint> = (IsQueryMethod<E> extends true
  ? DecorateQueryFn<E> & DecorateInfiniteQueryFn<E>
  : DecorateMutationFn<E>) &
  DecorateRouterKeyable

/**
 * Transform a pre-computed tree structure into react-query decorated endpoints
 * Uses the $tree from the registry to avoid recomputing the structure
 * Handles the case where a node is both an endpoint AND has children
 */
export type TransformToReactQuery<T> = {
  [K in keyof T]: T[K] extends SchemaEndpoint
    ? EndpointNode<T[K]> & TransformToReactQuery<Omit<T[K], EndpointKeys>>
    : TransformToReactQuery<T[K]>
} & DecorateRouterKeyable

export type TuyauReactQuery<R extends Record<string, SchemaEndpoint>> = TransformToReactQuery<R>
