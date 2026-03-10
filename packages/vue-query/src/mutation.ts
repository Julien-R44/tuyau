import { Tuyau } from '@tuyau/core/client'
import type { ErrorOf, RawRequestArgs, ResponseOf, SchemaEndpoint } from '@tuyau/core/types'
import type { MutationObserverOptions } from '@tanstack/query-core'
import { getMutationKeyInternal, createMutationFn } from '@tuyau/query-core'
import type { DistributiveOmit, TuyauQueryBaseOptions, TuyauMutationKey } from '@tuyau/query-core'

type ReservedOptions = 'mutationKey' | 'mutationFn'

/**
 * User-facing mutation options input. Extends TanStack's mutation observer
 * options but omits `mutationKey` and `mutationFn` which are auto-generated.
 * Uses `MutationObserverOptions` from `@tanstack/query-core` because
 * Vue Query does not export a `mutationOptions()` helper nor `MaybeRefDeep`.
 * Refs passed by users will still be unwrapped at runtime by `useMutation`'s
 * internal `cloneDeepUnref`
 */
export interface TuyauMutationOptionsIn<TInput, TError, TOutput, TContext>
  extends
    DistributiveOmit<
      MutationObserverOptions<TOutput, TError, TInput, TContext>,
      ReservedOptions
    >,
    TuyauQueryBaseOptions {}

/**
 * Fully resolved mutation options ready to be passed to Vue's `useMutation`.
 * Includes the auto-generated `mutationKey` and `mutationFn`
 */
export interface TuyauMutationOptionsOut<
  TInput,
  TError,
  TOutput,
  TContext,
> extends MutationObserverOptions<TOutput, TError, TInput, TContext> {
  mutationKey: TuyauMutationKey
}

/**
 * Callable interface exposed on mutation endpoints.
 * Returns fully resolved mutation options from user-provided options
 */
export interface TuyauVueMutationOptions<TDef extends SchemaEndpoint> {
  <TContext = unknown>(
    opts?: TuyauMutationOptionsIn<RawRequestArgs<TDef>, ErrorOf<TDef>, ResponseOf<TDef>, TContext>,
  ): TuyauMutationOptionsOut<RawRequestArgs<TDef>, ErrorOf<TDef>, ResponseOf<TDef>, TContext>
}

/**
 * Decorates mutation endpoints with `mutationOptions` and `mutationKey` methods
 */
export interface DecorateMutationFn<EDef extends SchemaEndpoint> {
  mutationOptions: TuyauVueMutationOptions<EDef>
  mutationKey: () => TuyauMutationKey
}

/**
 * Internal options for building a mutation options object
 */
export interface TuyauMutationOptionsOptions {
  opts?: TuyauMutationOptionsIn<any, any, any, any>
  routeName: string
  client: Tuyau<any>
}

/**
 * Builds a mutation options object from Tuyau route information.
 * Delegates mutationFn creation to the shared `createMutationFn` from `@tuyau/query-core`.
 *
 * Unlike React Query, Vue Query does not provide a `mutationOptions()` helper,
 * so this returns a plain object instead of calling a framework helper
 */
export function tuyauMutationOptions(options: TuyauMutationOptionsOptions): TuyauMutationOptionsOut<any, any, any, any> {
  const { opts, routeName, client } = options
  const mutationKey = getMutationKeyInternal({ segments: routeName.split('.') })
  const mutationFn = createMutationFn({ opts, routeName, client })
  return { ...opts, mutationKey, mutationFn }
}
