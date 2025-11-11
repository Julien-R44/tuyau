import { Tuyau } from '@tuyau/core/client'
import { QueryClient, QueryFilters } from '@tanstack/react-query'
import { AdonisEndpoint, RawRequestArgs } from '@tuyau/core/types'

import { buildKey } from './utils.ts'
import { tuyauQueryOptions } from './query.ts'
import { tuyauInfiniteQueryOptions } from './infinite_query.ts'
import { getMutationKeyInternal, tuyauMutationOptions } from './mutation.ts'
import type {
  DecorateRouterKeyable,
  TuyauQueryKey,
  TuyauReactQuery,
  TuyauReactRequestOptions,
} from './types/common.ts'

function segmentsToRouteName(segments: string[]): string {
  return segments.join('.')
}

export function createTuyauReactQueryClient<D extends Record<string, AdonisEndpoint>>(options: {
  client: Tuyau<D>
  queryClient: QueryClient | (() => QueryClient)
  globalOptions?: TuyauReactRequestOptions
}): TuyauReactQuery<D> & DecorateRouterKeyable {
  const { client, globalOptions } = options

  function makeReactQueryNamed(segments: string[]): any {
    const routeName = segmentsToRouteName(segments)
    const decoratedEndpoint = {
      /**
       * Queries
       */
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

      /**
       * Infinite Queries
       */
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
      infiniteQueryFilter: (
        request?: RawRequestArgs<any>,
        filters?: QueryFilters<TuyauQueryKey>,
      ) => ({
        queryKey: buildKey({ segments, request, type: 'infinite' }),
        ...filters,
      }),

      /**
       * Mutations
       */
      mutationOptions: (opts?: any) => tuyauMutationOptions({ opts, client, routeName }),
      mutationKey: () => getMutationKeyInternal({ segments }),

      /**
       * Paths
       */
      pathKey: () => buildKey({ segments, type: 'any' }),
      pathFilter: (filters?: QueryFilters<TuyauQueryKey>) => ({
        queryKey: buildKey({ segments, type: 'any' }),
        ...filters,
      }),
    }

    return new Proxy(decoratedEndpoint, {
      get: (target, prop) => {
        if (prop in target) return target[prop as keyof typeof target]
        return makeReactQueryNamed([...segments, String(prop)])
      },
    })
  }

  return makeReactQueryNamed([]) as TuyauReactQuery<D> & DecorateRouterKeyable
}
