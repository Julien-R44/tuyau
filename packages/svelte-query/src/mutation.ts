import type { SchemaEndpoint, RawRequestArgs, ErrorOf, ResponseOf } from '@tuyau/core/types'
import type { CreateMutationOptions } from '@tanstack/svelte-query'
import { getMutationKeyInternal, createMutationFn } from '@tuyau/query-core'
import type { DistributiveOmit, TuyauQueryBaseOptions, TuyauMutationKey } from '@tuyau/query-core'
import { Tuyau } from '@tuyau/core/client'

type ReservedOptions = 'mutationKey' | 'mutationFn'

/**
 * User-facing mutation options input. Extends TanStack's mutation observer
 * options but omits `mutationKey` and `mutationFn` which are auto-generated
 */
export interface TuyauMutationOptionsIn<TInput, TError, TOutput, TContext>
  extends
    DistributiveOmit<CreateMutationOptions<TOutput, TError, TInput, TContext>, ReservedOptions>,
    TuyauQueryBaseOptions {}

/**
 * Fully resolved mutation options ready to be passed to `createMutation`.
 * Includes the auto-generated `mutationKey` and `mutationFn`
 */
export interface TuyauMutationOptionsOut<
  TInput,
  TError,
  TOutput,
  TContext,
> extends CreateMutationOptions<TOutput, TError, TInput, TContext> {
  mutationKey: TuyauMutationKey
}

/**
 * Callable interface exposed on mutation endpoints.
 * Returns fully resolved mutation options from user-provided options
 */
export interface TuyauSvelteMutationOptions<TDef extends SchemaEndpoint> {
  <TContext = unknown>(
    opts?: TuyauMutationOptionsIn<RawRequestArgs<TDef>, ErrorOf<TDef>, ResponseOf<TDef>, TContext>,
  ): TuyauMutationOptionsOut<RawRequestArgs<TDef>, ErrorOf<TDef>, ResponseOf<TDef>, TContext>
}

/**
 * Decorates mutation endpoints with `mutationOptions` and `mutationKey` methods
 */
export interface DecorateMutationFn<EDef extends SchemaEndpoint> {
  mutationOptions: TuyauSvelteMutationOptions<EDef>
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
 * Builds a TanStack Svelte Query `mutationOptions` object from Tuyau route information.
 * Delegates mutationFn creation to the shared `createMutationFn` from `@tuyau/query-core`.
 *
 * @tanstack/svelte-query's barrel export re-exports .svelte component files
 * (HydrationBoundary, QueryClientProvider) which Node.js cannot load without
 * a Svelte compiler. Since `mutationOptions` is a pure identity function (it just
 * returns its input for type inference), we construct the result directly
 */
export function tuyauMutationOptions(
  options: TuyauMutationOptionsOptions,
): TuyauMutationOptionsOut<any, any, any, any> {
  const { opts, routeName, client } = options
  const mutationKey = getMutationKeyInternal({ segments: routeName.split('.') })
  const mutationFn = createMutationFn({ opts, routeName, client })
  return { ...opts, mutationKey, mutationFn }
}
