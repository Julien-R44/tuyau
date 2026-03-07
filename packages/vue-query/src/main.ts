import { Tuyau } from '@tuyau/core/client'
import { buildKey, segmentsToRouteName, getMutationKeyInternal } from '@tuyau/query-core'
import type { QueryFilters } from '@tanstack/query-core'
import type {
  AdonisEndpoint,
  InferRoutes,
  InferTree,
  RawRequestArgs,
  TuyauRegistry,
} from '@tuyau/core/types'
import type { TuyauQueryKey, TuyauRequestOptions } from '@tuyau/query-core'

import { tuyauQueryOptions } from './query.ts'
import { tuyauInfiniteQueryOptions } from './infinite_query.ts'
import { tuyauMutationOptions } from './mutation.ts'
import type { TransformToVueQuery } from './types/common.ts'

/**
 * Creates a type-safe TanStack Vue Query client from a Tuyau client instance.
 * Returns a Proxy-based object that mirrors the API route tree and exposes
 * `queryOptions`, `mutationOptions`, `infiniteQueryOptions`, and key/filter
 * helpers on each endpoint node.
 *
 * GET/HEAD endpoints get query and infinite query methods.
 * Other methods (POST, PUT, etc.) get mutation methods.
 * All nodes get `pathKey` and `pathFilter` for cache operations
 */
export function createTuyauVueQueryClient<
  Reg extends TuyauRegistry,
  Tree = InferTree<Reg>,
  Routes extends Record<string, AdonisEndpoint> = InferRoutes<Reg>,
>(options: {
  client: Tuyau<Reg, Routes>
  globalOptions?: TuyauRequestOptions
}): TransformToVueQuery<Tree> {
  const { client, globalOptions } = options

  function makeVueQueryNamed(segments: string[]): any {
    const routeName = segmentsToRouteName(segments)
    const decoratedEndpoint = {
      queryOptions: (request: RawRequestArgs<any>, opts?: any) => {
        return tuyauQueryOptions({
          opts,
          client,
          request,
          routeName,
          globalOptions,
          queryKey: buildKey({ segments, request, type: 'query' }),
        })
      },

      queryKey: (request: RawRequestArgs<any>) => buildKey({ segments, request, type: 'query' }),
      queryFilter: (request?: RawRequestArgs<any>, filters?: QueryFilters<TuyauQueryKey>) => ({
        queryKey: buildKey({ segments, request, type: 'query' }),
        ...filters,
      }),

      infiniteQueryOptions: (request: RawRequestArgs<any>, opts?: any) => {
        return tuyauInfiniteQueryOptions({
          opts,
          client,
          request,
          routeName,
          globalOptions,
          queryKey: buildKey({ segments, request, type: 'infinite' }),
        })
      },

      infiniteQueryKey: (request: RawRequestArgs<any>) =>
        buildKey({ segments, request, type: 'infinite' }),
      infiniteQueryFilter: (request?: RawRequestArgs<any>, filters?: QueryFilters<any>) => ({
        queryKey: buildKey({ segments, request, type: 'infinite' }),
        ...filters,
      }),

      mutationOptions: (opts?: any) => tuyauMutationOptions({ opts, client, routeName }),
      mutationKey: () => getMutationKeyInternal({ segments }),

      pathKey: () => buildKey({ segments, type: 'any' }),
      pathFilter: (filters?: QueryFilters<TuyauQueryKey>) => ({
        queryKey: buildKey({ segments, type: 'any' }),
        ...filters,
      }),
    }

    return new Proxy(decoratedEndpoint, {
      get: (target, prop) => {
        if (typeof prop === 'symbol') return undefined
        if (prop in target) return target[prop as keyof typeof target]
        return makeVueQueryNamed([...segments, String(prop)])
      },
    })
  }

  return makeVueQueryNamed([]) as TransformToVueQuery<Tree>
}
