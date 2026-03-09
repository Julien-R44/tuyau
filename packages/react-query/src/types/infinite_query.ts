import type { TuyauError } from '@tuyau/core/client'
import type {
  ErrorResponseOf,
  NormalizeError,
  SchemaEndpoint,
  RawRequestArgs,
} from '@tuyau/core/types'
import type {
  DataTag,
  DefinedInitialDataInfiniteOptions,
  InfiniteData,
  QueryFilters,
  SkipToken,
  UndefinedInitialDataInfiniteOptions,
  UnusedSkipTokenInfiniteOptions,
} from '@tanstack/react-query'

import type { DistributiveOmit, WithRequired } from '@tuyau/query-core'
import type { TuyauQueryBaseOptions, TuyauQueryKey } from './common.ts'

type Response<E extends SchemaEndpoint> = E['types']['response']
type Error<E extends SchemaEndpoint> = TuyauError<NormalizeError<ErrorResponseOf<E>>>

type ReservedInfiniteQueryOptions = 'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'

/**
 * Base infinite query options with Tuyau-specific options
 */
interface TuyauInfiniteQueryBaseOptionsIn {
  /**
   * The key that will be used for the page parameter in the request.
   * For example, if your API expects ?page=1, set this to 'page'.
   * If your API expects ?cursor=abc, set this to 'cursor'.
   */
  pageParamKey?: string
}

/**
 * Infinite query options when initialData is undefined (default case)
 */
export interface UndefinedTuyauInfiniteQueryOptionsIn<TQueryFnData, TError, TData>
  extends
    DistributiveOmit<
      UndefinedInitialDataInfiniteOptions<TQueryFnData, TError, TData, TuyauQueryKey, unknown>,
      ReservedInfiniteQueryOptions
    >,
    TuyauQueryBaseOptions,
    TuyauInfiniteQueryBaseOptionsIn {}

/**
 * Output type when initialData is undefined - queryFn can be SkipToken
 */
export interface UndefinedTuyauInfiniteQueryOptionsOut<
  TQueryFnData,
  TError,
  TData,
> extends DistributiveOmit<
  UndefinedInitialDataInfiniteOptions<TQueryFnData, TError, TData, TuyauQueryKey, unknown>,
  'queryKey'
> {
  queryKey: DataTag<TuyauQueryKey, TData>
}

/**
 * Infinite query options when initialData is defined
 */
export interface DefinedTuyauInfiniteQueryOptionsIn<TQueryFnData, TError, TData>
  extends
    DistributiveOmit<
      DefinedInitialDataInfiniteOptions<TQueryFnData, TError, TData, TuyauQueryKey, unknown>,
      ReservedInfiniteQueryOptions
    >,
    TuyauQueryBaseOptions,
    TuyauInfiniteQueryBaseOptionsIn {}

/**
 * Output type when initialData is defined - queryFn can be SkipToken
 */
export interface DefinedTuyauInfiniteQueryOptionsOut<
  TQueryFnData,
  TError,
  TData,
> extends DistributiveOmit<
  DefinedInitialDataInfiniteOptions<TQueryFnData, TError, TData, TuyauQueryKey, unknown>,
  'queryKey'
> {
  queryKey: DataTag<TuyauQueryKey, TData>
}

/**
 * Infinite query options when SkipToken is NOT used as input.
 * This makes the result compatible with useSuspenseInfiniteQuery.
 */
export interface UnusedSkipTokenTuyauInfiniteQueryOptionsIn<TQueryFnData, TError, TData>
  extends
    DistributiveOmit<
      UnusedSkipTokenInfiniteOptions<TQueryFnData, TError, TData, TuyauQueryKey, unknown>,
      ReservedInfiniteQueryOptions
    >,
    TuyauQueryBaseOptions,
    TuyauInfiniteQueryBaseOptionsIn {}

/**
 * Output type when SkipToken is NOT used - queryFn excludes SkipToken.
 * This makes it compatible with useSuspenseInfiniteQuery.
 */
export interface UnusedSkipTokenTuyauInfiniteQueryOptionsOut<
  TQueryFnData,
  TError,
  TData,
> extends DistributiveOmit<
  UnusedSkipTokenInfiniteOptions<TQueryFnData, TError, TData, TuyauQueryKey, unknown>,
  'queryKey'
> {
  queryKey: DataTag<TuyauQueryKey, TData>
}

/**
 * Any infinite query options input type (used internally)
 */
export type AnyTuyauInfiniteQueryOptionsIn<TQueryFnData, TError, TData> =
  | UndefinedTuyauInfiniteQueryOptionsIn<TQueryFnData, TError, TData>
  | DefinedTuyauInfiniteQueryOptionsIn<TQueryFnData, TError, TData>
  | UnusedSkipTokenTuyauInfiniteQueryOptionsIn<TQueryFnData, TError, TData>

/**
 * Type definition for infinite query options with proper overloads.
 */
export interface TuyauReactInfiniteQueryOptions<EDef extends SchemaEndpoint> {
  /**
   * Overload 1: When input is NOT SkipToken, return options compatible with useSuspenseInfiniteQuery
   */
  <TData = InfiniteData<Response<EDef>>>(
    input: RawRequestArgs<EDef>,
    opts: UnusedSkipTokenTuyauInfiniteQueryOptionsIn<Response<EDef>, Error<EDef>, TData>,
  ): UnusedSkipTokenTuyauInfiniteQueryOptionsOut<Response<EDef>, Error<EDef>, TData>

  /**
   * Overload 2: When initialData is defined
   */
  <TData = InfiniteData<Response<EDef>>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: DefinedTuyauInfiniteQueryOptionsIn<Response<EDef>, Error<EDef>, TData>,
  ): DefinedTuyauInfiniteQueryOptionsOut<Response<EDef>, Error<EDef>, TData>

  /**
   * Overload 3: No arguments - no skipToken possible
   */
  (): UnusedSkipTokenTuyauInfiniteQueryOptionsOut<
    Response<EDef>,
    Error<EDef>,
    InfiniteData<Response<EDef>>
  >

  /**
   * Overload 4: With skipToken or conditional (request | skipToken) and options
   */
  <TData = InfiniteData<Response<EDef>>>(
    input: RawRequestArgs<EDef> | SkipToken,
    opts: UndefinedTuyauInfiniteQueryOptionsIn<Response<EDef>, Error<EDef>, TData>,
  ): UndefinedTuyauInfiniteQueryOptionsOut<Response<EDef>, Error<EDef>, TData>
}

/**
 * Decorate query endpoints with infinite query capabilities
 */
export interface DecorateInfiniteQueryFn<EDef extends SchemaEndpoint> {
  infiniteQueryOptions: TuyauReactInfiniteQueryOptions<EDef>
  infiniteQueryKey: (
    args?: RawRequestArgs<EDef>,
  ) => DataTag<TuyauQueryKey, InfiniteData<Response<EDef>>>
  infiniteQueryFilter: (
    args?: RawRequestArgs<EDef>,
    filters?: QueryFilters<DataTag<TuyauQueryKey, InfiniteData<Response<EDef>>>>,
  ) => WithRequired<QueryFilters<DataTag<TuyauQueryKey, InfiniteData<Response<EDef>>>>, 'queryKey'>
}
