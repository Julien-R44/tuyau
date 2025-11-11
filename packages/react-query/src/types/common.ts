import {
  AdonisEndpoint,
  Method,
  RawRequestArgs,
  Split,
  StrKeys,
  UnionToIntersection,
} from '@tuyau/core/types'
import {
  DataTag,
  DefinedInitialDataOptions,
  QueryFilters,
  UndefinedInitialDataOptions,
  UnusedSkipTokenOptions,
} from '@tanstack/react-query'

import { DecorateQueryFn } from './query.ts'
import { DecorateMutationFn } from '../mutation.ts'
import { DistributiveOmit, WithRequired } from './utils.ts'
import { DecorateInfiniteQueryFn } from './infinite_query.ts'

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

export type EndpointNode<E extends AdonisEndpoint> = E extends {
  methods: readonly (infer M extends Method)[]
}
  ? M extends 'GET' | 'HEAD'
    ? DecorateQueryFn<E> & DecorateInfiniteQueryFn<E> & DecorateRouterKeyable
    : DecorateMutationFn<E> & DecorateRouterKeyable
  : DecorateRouterKeyable

export interface TypeHelper<EDef extends AdonisEndpoint> {
  /**
   * @internal
   */
  '~types': { request: EDef['types']['body']; response: EDef['types']['response'] }
}

type SetAtPathWithKeyable<Path extends string[], V> = Path extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? { [K in H]: T['length'] extends 0 ? V : SetAtPathWithKeyable<T, V> & DecorateRouterKeyable }
  : {}

type BuildNamespaces<R extends Record<string, AdonisEndpoint>> = UnionToIntersection<
  {
    [K in StrKeys<R>]: SetAtPathWithKeyable<Split<K>, EndpointNode<R[K]>>
  }[StrKeys<R>]
> &
  DecorateRouterKeyable

export type TuyauReactQuery<R extends Record<string, AdonisEndpoint>> = BuildNamespaces<R>
