import type { TuyauClient } from '@tuyau/client'
import {
  MutationFunction,
  QueryClient,
  mutationOptions,
  UseMutationOptions,
} from '@tanstack/react-query'

import { buildRequestPath, unwrapLazyArg } from './utils.js'
import {
  TuyauMutationKey,
  EndpointDef,
  MaybePromise,
  TypeHelper,
  TuyauMutationOptionsIn,
  UnionFromSuccessStatuses,
} from './types.js'

/**
 * Interface for mutation options override
 */
export interface MutationOptionsOverride {
  onSuccess: (opts: {
    /**
     * Calls the original function that was defined in the mutation's `onSuccess` option
     */
    originalFn: () => MaybePromise<void>
    queryClient: QueryClient
    meta: Record<string, unknown>
  }) => MaybePromise<void>
}

/**
 * Generate a Tuyau mutation key from path
 */
export function getMutationKeyInternal(path: readonly string[]): TuyauMutationKey {
  const splitPath = path.flatMap((part) => part.toString().split('.'))
  return splitPath.length ? [splitPath] : ([] as unknown as TuyauMutationKey)
}

/**
 * Create mutation options for Tuyau with React Query integration
 */
export function tuyauMutationOptions(args: {
  opts: any
  path: string[]
  queryClient: QueryClient | (() => QueryClient)
  client: TuyauClient<any, any>
  overrides?: MutationOptionsOverride
}) {
  const { opts, path, client, overrides } = args
  const queryClient = unwrapLazyArg(args.queryClient)

  const mutationKey = getMutationKeyInternal(path)

  const defaultOpts = queryClient.defaultMutationOptions(
    queryClient.getMutationDefaults(mutationKey),
  )

  const mutationSuccessOverride: MutationOptionsOverride['onSuccess'] =
    overrides?.onSuccess ?? ((options) => options.originalFn())

  const mutationFn: MutationFunction<any, any> = async (input: {
    payload: any
    params?: Record<string, string | number>
  }) => {
    const requestPath = buildRequestPath(path, input.params)

    // @ts-expect-error - Using internal API for client fetch
    return await client.$fetch({ paths: requestPath, input: input.payload })
  }

  const onSuccess = (data: any, variables: any, context: any) => {
    const originalFn = () => {
      if (opts?.onSuccess) return opts.onSuccess(data, variables, context)
      if (defaultOpts?.onSuccess) return defaultOpts.onSuccess(data, variables, context)
    }

    return mutationSuccessOverride({
      originalFn,
      queryClient,
      meta: opts?.meta ?? defaultOpts?.meta ?? {},
    })
  }

  return Object.assign(mutationOptions({ ...opts, mutationKey, mutationFn, onSuccess }), {
    tuyau: { path, type: 'mutation' as const },
  })
}

/**
 * Interface for mutation function decorators
 */
export interface DecorateMutationFn<
  EDef extends EndpointDef,
  TParams = Record<string, string | number>,
> extends TypeHelper<EDef> {
  mutationOptions: TuyauReactMutationOptions<EDef, TParams>
  mutationKey: () => TuyauMutationKey
}

/**
 * Output type for mutation options
 */
export interface TuyauMutationOptionsOut<
  TInput,
  TError,
  TOutput,
  TContext,
  TParams = Record<string, string | number>,
> extends UseMutationOptions<
    TOutput,
    TError,
    TInput extends undefined | {} | Record<string, never>
      ? { payload?: TInput; params?: TParams }
      : { payload: TInput; params?: TParams },
    TContext
  > {
  mutationKey: TuyauMutationKey
}

/**
 * Type definition for mutation options
 */
export interface TuyauReactMutationOptions<
  TDef extends EndpointDef,
  TParams = Record<string, string | number>,
> {
  <TContext = unknown>(
    opts?: TuyauMutationOptionsIn<
      TDef['request'],
      any,
      UnionFromSuccessStatuses<TDef['response']>,
      TContext,
      TParams
    >,
  ): TuyauMutationOptionsOut<
    TDef['request'],
    any,
    UnionFromSuccessStatuses<TDef['response']>,
    TContext,
    TParams
  >
}
