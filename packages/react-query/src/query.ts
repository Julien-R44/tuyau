import type { TuyauClient } from '@tuyau/client'
import {
  DataTag,
  QueryFilters,
  QueryClient,
  queryOptions,
  skipToken,
  SkipToken,
} from '@tanstack/react-query'

import { buildRequestPath } from './utils.js'
import {
  TuyauQueryKey,
  QueryType,
  EndpointDef,
  UnionFromSuccessStatuses,
  WithRequired,
  DefinedTuyauQueryOptionsIn,
  UndefinedTuyauQueryOptionsIn,
  UnusedSkipTokenTuyauQueryOptionsIn,
  DefinedTuyauQueryOptionsOut,
  UndefinedTuyauQueryOptionsOut,
  UnusedSkipTokenTuyauQueryOptionsOut,
} from './types.js'

/**
 * Generate a Tuyau query key from path and input parameters
 * Following the pattern used by tRPC for consistent query key generation
 */
export function getQueryKeyInternal(
  path: string[],
  input?: unknown,
  type?: QueryType,
): TuyauQueryKey {
  const splitPath = path.flatMap((part) => part.toString().split('/'))

  if (!input && (!type || type === 'any')) {
    return splitPath.length ? [splitPath] : ([] as unknown as TuyauQueryKey)
  }

  return [
    splitPath,
    {
      ...(typeof input !== 'undefined' && input !== skipToken && { input }),
      ...(type && type !== 'any' && { type }),
    },
  ]
}

/**
 * Create query options for Tuyau with React Query integration
 *
 * This function creates a React Query queryOptions object that works with Tuyau's type system.
 * It handles skipToken for conditional queries and extracts payload/params from input.
 */
export function tuyauQueryOptions(options: {
  input: unknown
  opts: any
  queryKey: TuyauQueryKey
  queryClient: QueryClient
  path: string[]
  client: TuyauClient<any, any>
}) {
  const { input, opts, queryKey, path, client } = options
  const inputIsSkipToken = input === skipToken

  const queryFn = inputIsSkipToken
    ? skipToken
    : async () => {
        const { payload, requestPath } = extractInputAndPath(input, path)
        // @ts-expect-error - Using internal API for client fetch
        return await client.$fetch({ paths: requestPath, input: payload })
      }

  return Object.assign(queryOptions({ ...opts, queryKey, queryFn }), {
    tuyau: { path, type: 'query' as const },
  })
}

/**
 * Extract payload and build request path from input and path segments
 *
 * This function handles the transformation of input that can be:
 * - A simple payload (used as-is)
 * - An object with { payload, params } where params are used for route parameters
 */
function extractInputAndPath(input: unknown, path: string[]) {
  if (
    typeof input !== 'object' ||
    input === null ||
    (!('payload' in input) && !('params' in input))
  ) {
    return { payload: input, requestPath: path }
  }

  const { payload, params } = input as {
    payload?: any
    params?: Record<string, string | number>
  }

  const requestPath = buildRequestPath(path, params)
  return { payload, requestPath }
}

/**
 * Type definition for query options with overloads for different scenarios
 */
export interface TuyauReactQueryOptions<
  EDef extends EndpointDef,
  TParams = Record<string, string | number>,
> {
  // With initial data - when opts has initialData defined
  <TData = UnionFromSuccessStatuses<EDef['response']>>(
    input: { payload?: EDef['request']; params?: TParams } | SkipToken,
    opts: DefinedTuyauQueryOptionsIn<UnionFromSuccessStatuses<EDef['response']>, TData, any>,
  ): DefinedTuyauQueryOptionsOut<UnionFromSuccessStatuses<EDef['response']>, TData, any>

  // Without skipToken - when input is not SkipToken and no initialData
  <TData = UnionFromSuccessStatuses<EDef['response']>>(
    input: { payload?: EDef['request']; params?: TParams },
    opts?: UnusedSkipTokenTuyauQueryOptionsIn<
      UnionFromSuccessStatuses<EDef['response']>,
      TData,
      any
    >,
  ): UnusedSkipTokenTuyauQueryOptionsOut<UnionFromSuccessStatuses<EDef['response']>, TData, any>

  // Without initial data - when opts has no initialData or input can be SkipToken
  <TData = UnionFromSuccessStatuses<EDef['response']>>(
    input?: { payload?: EDef['request']; params?: TParams } | SkipToken,
    opts?: UndefinedTuyauQueryOptionsIn<UnionFromSuccessStatuses<EDef['response']>, TData, any>,
  ): UndefinedTuyauQueryOptionsOut<UnionFromSuccessStatuses<EDef['response']>, TData, any>
}

/**
 * Interface for query function decorators (queryOptions, queryKey, queryFilter)
 */
export interface DecorateQueryFn<
  EDef extends EndpointDef,
  TParams = Record<string, string | number>,
> {
  queryOptions: TuyauReactQueryOptions<EDef, TParams>
  queryKey: (input?: {
    payload?: Partial<EDef['request']>
    params?: TParams
  }) => DataTag<TuyauQueryKey, UnionFromSuccessStatuses<EDef['response']>, any>
  queryFilter: (
    input?: { payload?: Partial<EDef['request']>; params?: TParams },
    filters?: QueryFilters<DataTag<TuyauQueryKey, UnionFromSuccessStatuses<EDef['response']>, any>>,
  ) => WithRequired<
    QueryFilters<DataTag<TuyauQueryKey, UnionFromSuccessStatuses<EDef['response']>, any>>,
    'queryKey'
  >
}
