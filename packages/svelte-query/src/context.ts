import { setContext, getContext } from 'svelte'
import type { Tuyau } from '@tuyau/core/client'
import type { AdonisEndpoint, InferRoutes, TuyauRegistry } from '@tuyau/core/types'

import { createTuyauSvelteQueryClient } from './main.ts'
import type { TuyauSvelteQuery } from './types/common.ts'

const TUYAU_KEY = Symbol('tuyau')
const TUYAU_CLIENT_KEY = Symbol('tuyau-client')

/**
 * Options for setting up Tuyau context in a Svelte component tree
 */
export interface SetTuyauContextOptions<
  TRegistry extends TuyauRegistry,
  TRoutes extends Record<string, AdonisEndpoint> = InferRoutes<TRegistry>,
> {
  client: Tuyau<TRegistry, TRoutes>
}

/**
 * Sets up the Tuyau context in a Svelte component tree.
 * Must be called during component initialization (in `<script>` of a parent component).
 *
 * @example
 * ```svelte
 * <script>
 *   import { setTuyauContext } from '@tuyau/svelte-query'
 *   import { client } from './tuyau'
 *
 *   setTuyauContext({ client })
 * </script>
 * ```
 */
export function setTuyauContext<
  TRegistry extends TuyauRegistry,
  TRoutes extends Record<string, AdonisEndpoint> = InferRoutes<TRegistry>,
>(options: SetTuyauContextOptions<TRegistry, TRoutes>) {
  const queryClient = createTuyauSvelteQueryClient({ client: options.client })
  setContext(TUYAU_KEY, queryClient)
  setContext(TUYAU_CLIENT_KEY, options.client)
  return queryClient
}

/**
 * Retrieves the Tuyau Svelte Query client from context.
 * Must be called during component initialization.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useTuyau } from '@tuyau/svelte-query'
 *   import { createQuery } from '@tanstack/svelte-query'
 *
 *   const tuyau = useTuyau()
 *   const query = createQuery(() => tuyau.users.index.queryOptions())
 * </script>
 * ```
 */
export function useTuyau<
  TRegistry extends TuyauRegistry,
  TRoutes extends Record<string, AdonisEndpoint> = InferRoutes<TRegistry>,
>(): TuyauSvelteQuery<TRoutes> {
  const ctx = getContext<TuyauSvelteQuery<TRoutes> | undefined>(TUYAU_KEY)
  if (!ctx) {
    throw new Error(
      'useTuyau() must be called during component initialization after setTuyauContext()',
    )
  }
  return ctx
}

/**
 * Retrieves the raw Tuyau client from context.
 * Must be called during component initialization.
 */
export function useTuyauClient<
  TRegistry extends TuyauRegistry,
  TRoutes extends Record<string, AdonisEndpoint> = InferRoutes<TRegistry>,
>(): Tuyau<TRegistry, TRoutes> {
  const client = getContext<Tuyau<TRegistry, TRoutes> | undefined>(TUYAU_CLIENT_KEY)
  if (!client) {
    throw new Error(
      'useTuyauClient() must be called during component initialization after setTuyauContext()',
    )
  }
  return client
}
