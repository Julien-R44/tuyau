import type { TuyauClient } from '@tuyau/client'
import { MutationFunction, QueryClient } from '@tanstack/react-query'

import { buildRequestPath, unwrapLazyArg } from './utils.js'
import { TuyauMutationKey, EndpointDef, TuyauReactMutationOptions, MaybePromise } from './types.js'

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
    /**
     * Meta data passed in from the `useMutation()` hook
     */
    meta: Record<string, unknown>
  }) => MaybePromise<void>
}

/**
 * Generate a Tuyau mutation key from path
 * Similar to query key but simpler structure for mutations
 */
export function getMutationKeyInternal(path: readonly string[]): TuyauMutationKey {
  const splitPath = path.flatMap((part) => part.toString().split('.'))
  return splitPath.length ? [splitPath] : ([] as unknown as TuyauMutationKey)
}

/**
 * Create Tuyau options result metadata
 */
function createTuyauOptionsResult(opts: { path: string[] }) {
  return {
    path: opts.path,
    type: 'mutation' as const,
  }
}

/**
 * Create mutation options for Tuyau with React Query integration
 * Supports params and payload for flexible mutation handling
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

  // Get default mutation options from QueryClient
  const defaultOpts = queryClient.defaultMutationOptions(
    queryClient.getMutationDefaults(mutationKey),
  )

  // Use override or default to just call original function
  const mutationSuccessOverride: MutationOptionsOverride['onSuccess'] =
    overrides?.onSuccess ?? ((options) => options.originalFn())

  /**
   * Mutation function that calls the Tuyau client
   * The input parameter should be of the form { payload: actualPayload, params?: routeParams }
   */
  const mutationFn: MutationFunction<any, any> = async (input: {
    payload: any
    params?: Record<string, string | number>
  }) => {
    const requestPath = buildRequestPath(path, input.params)

    // @ts-expect-error - Using internal API for client fetch
    return await client.$fetch({
      paths: requestPath,
      input: input.payload,
    })
  }

  return {
    ...opts,
    mutationKey,
    mutationFn,
    onSuccess(data: any, variables: any, context: any) {
      const originalFn = () => {
        if (opts?.onSuccess) return opts.onSuccess(data, variables, context)
        if (defaultOpts?.onSuccess) return defaultOpts.onSuccess(data, variables, context)
      }

      return mutationSuccessOverride({
        originalFn,
        queryClient,
        meta: opts?.meta ?? defaultOpts?.meta ?? {},
      })
    },
    tuyau: createTuyauOptionsResult({ path }),
  }
}

/**
 * Interface for mutation function decorators (mutationOptions, mutationKey)
 */
export interface DecorateMutationFn<
  EDef extends EndpointDef,
  TParams = Record<string, string | number>,
> {
  mutationOptions: TuyauReactMutationOptions<EDef, TParams>
  mutationKey: () => TuyauMutationKey
}
