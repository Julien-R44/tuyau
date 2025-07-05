import {
  DataTag,
  DefinedInitialDataOptions,
  QueryFilters,
  UndefinedInitialDataOptions,
  UnusedSkipTokenOptions,
  UseMutationOptions,
} from '@tanstack/react-query'

import { DecorateQueryFn } from './query.js'
import { DecorateMutationFn } from './mutation.js'

/**
 * Extract union type from successful HTTP status codes (200-299)
 */
export type UnionFromSuccessStatuses<Res extends Record<number, unknown>> = Res[Extract<
  keyof Res,
  200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
>]

/**
 * Base endpoint definition structure
 */
export type EndpointDef = {
  request: Record<string, unknown>
  response: Record<number, unknown>
}

/**
 * Query type identifier
 */
export type QueryType = 'any' | 'infinite' | 'query'

/**
 * Tuyau-specific query key structure
 */
export type TuyauQueryKey = [
  readonly string[],
  { payload?: unknown; params?: unknown; type?: 'infinite' | 'query' }?,
]

/**
 * Tuyau-specific mutation key structure
 */
export type TuyauMutationKey = [readonly string[]]

/**
 * Omits the key without removing a potential union
 */
export type DistributiveOmit<TObj, TKey extends keyof any> = TObj extends any
  ? Omit<TObj, TKey>
  : never

/**
 * Make certain keys required in a type
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Query options with defined initial data
 */
export interface DefinedTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends DistributiveOmit<
    DefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
    'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
  > {}

/**
 * Query options with undefined initial data
 */
export interface UndefinedTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends DistributiveOmit<
    UndefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
    'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
  > {}

/**
 * Query options with unused skip token
 */
export interface UnusedSkipTokenTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends DistributiveOmit<
    UnusedSkipTokenOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
    'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'
  > {}

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
 * Input type for mutation options with params and payload support
 */
export interface TuyauMutationOptionsIn<
  TInput,
  TError,
  TOutput,
  TContext,
  TParams = Record<string, string | number>,
> extends DistributiveOmit<
    UseMutationOptions<TOutput, TError, { payload: TInput; params?: TParams }, TContext>,
    'mutationKey' | 'mutationFn'
  > {
  /**
   * Route parameters to be passed to the mutation
   */
  params?: TParams
}

/**
 * Interface for router keyable decorators (pathKey, pathFilter)
 */
export interface DecorateRouterKeyable {
  pathKey: () => TuyauQueryKey
  pathFilter: (
    filters?: QueryFilters<TuyauQueryKey>,
  ) => WithRequired<QueryFilters<TuyauQueryKey>, 'queryKey'>
}

/**
 * Type for promise that might be synchronous
 */
export type MaybePromise<T> = T | Promise<T>

export interface TypeHelper<EDef extends EndpointDef> {
  /**
   * @internal
   */
  '~types': { request: EDef['request']; response: EDef['response'] }
}

/**
 * Infer request type from an endpoint
 */
export type InferRequestType<Endpoint extends DecorateQueryFn<any> | DecorateMutationFn<any>> =
  Endpoint['~types']['request']

/**
 * Infer response type from an endpoint
 */
export type InferResponseType<Endpoint extends DecorateQueryFn<any> | DecorateMutationFn<any>> =
  Endpoint['~types']['response']
