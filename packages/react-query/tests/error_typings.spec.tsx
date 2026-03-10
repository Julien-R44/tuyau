import { test } from '@japa/runner'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { createTuyau } from '@tuyau/core/client'
import type { RouteWithRegistry } from '@tuyau/core/types'
import { errorRegistry } from '@tuyau/query-core/test-helpers'

import { createTuyauReactQueryClient } from '../src/index.ts'
import { renderHookWithWrapper } from './helpers/index.tsx'

test.group('Typing | errors', () => {
  test('queryOptions exposes typed error narrowing', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: errorRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const { result } = renderHookWithWrapper(() =>
      useQuery(
        tuyau.contacts.show.queryOptions(
          { params: { id: '1' } },
          {
            enabled: false,
          },
        ),
      ),
    )

    type QueryError = RouteWithRegistry.Error<typeof errorRegistry.routes, 'contacts.show'>

    const assertTypedError = (error: QueryError) => {
      if (error.isStatus(404)) {
        expectTypeOf(error.response).toEqualTypeOf<{ message: string; id: string }>()
      }

      if (error.isStatus(422)) {
        expectTypeOf(error.response).toEqualTypeOf<{ field: string }>()
      }
    }

    expectTypeOf(result.current.error).toEqualTypeOf<QueryError | null>()
    expectTypeOf(assertTypedError).toBeCallableWith({} as QueryError)
  })

  test('mutationOptions exposes typed error narrowing', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: errorRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.contacts.store.mutationOptions({
          onError: (error) => {
            if (error.isStatus(409)) {
              expectTypeOf(error.response).toEqualTypeOf<{
                message: string
                existingId: number
              }>()
            }

            if (error.isStatus(422)) {
              expectTypeOf(error.response).toEqualTypeOf<{ field: string }>()
            }
          },
        }),
      ),
    )

    type MutationError = RouteWithRegistry.Error<typeof errorRegistry.routes, 'contacts.store'>

    const assertTypedError = (error: MutationError) => {
      if (error.isStatus(409)) {
        expectTypeOf(error.response).toEqualTypeOf<{ message: string; existingId: number }>()
      }

      if (error.isStatus(422)) {
        expectTypeOf(error.response).toEqualTypeOf<{ field: string }>()
      }
    }

    expectTypeOf(result.current.error).toEqualTypeOf<MutationError | null>()
    expectTypeOf(assertTypedError).toBeCallableWith({} as MutationError)
  })

  test('infiniteQueryOptions exposes typed error narrowing', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: errorRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const { result } = renderHookWithWrapper(() =>
      useInfiniteQuery(
        tuyau.articles.index.infiniteQueryOptions(
          { query: { page: 1 } },
          {
            enabled: false,
            initialPageParam: 1,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
          },
        ),
      ),
    )

    type InfiniteQueryError = RouteWithRegistry.Error<typeof errorRegistry.routes, 'articles.index'>

    const assertTypedError = (error: InfiniteQueryError) => {
      if (error.isStatus(404)) {
        expectTypeOf(error.response).toEqualTypeOf<{ message: string }>()
      }

      if (error.isStatus(422)) {
        expectTypeOf(error.response).toEqualTypeOf<{ field: string }>()
      }
    }

    expectTypeOf(result.current.error).toEqualTypeOf<InfiniteQueryError | null>()
    expectTypeOf(assertTypedError).toBeCallableWith({} as InfiniteQueryError)
  })
})
