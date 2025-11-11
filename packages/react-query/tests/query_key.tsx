import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { useQueryClient } from '@tanstack/react-query'

import { defaultRegistry } from './fixtures/index.ts'
import { TuyauQueryKey } from '../src/types/common.ts'
import { createTuyauReactQueryClient } from '../src/main.ts'
import { queryClient, renderHookWithWrapper } from './helpers/index.tsx'

const testContext = () => {
  const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
  const tuyau = createTuyauReactQueryClient({ client, queryClient })

  return { client, tuyau }
}

test.group('get queryFilter', () => {
  test('gets various query filters', ({ assert }) => {
    const { tuyau } = testContext()

    const Component = () => {
      assert.deepEqual(tuyau.pathFilter(), { queryKey: [] })

      assert.deepEqual(tuyau.users.pathFilter(), { queryKey: [['users']] })
      assert.deepEqual(tuyau.users.bar.pathFilter(), { queryKey: [['users', 'bar']] })
      assert.deepEqual(tuyau.users.bar.pathFilter(), { queryKey: [['users', 'bar']] })

      // Test queryFilter with input - should include request data
      assert.deepEqual(tuyau.users.show.queryFilter({ params: { id: '1' } }), {
        queryKey: [
          ['users', 'show'],
          {
            request: { params: { id: '1' } },
            type: 'query',
          },
        ],
      })

      assert.deepEqual(
        tuyau.users.index.queryFilter({ query: { name: 'foo', email: 'test@example.com' } }),
        {
          queryKey: [
            ['users', 'index'],
            {
              request: { query: { name: 'foo', email: 'test@example.com' } },
              type: 'query',
            },
          ],
        },
      )

      const filterWithOptions = tuyau.users.show.queryFilter(
        { params: { id: '1' } },
        { stale: true, exact: false },
      )

      assert.property(filterWithOptions, 'queryKey')
      assert.property(filterWithOptions, 'stale')
      assert.property(filterWithOptions, 'exact')
      assert.equal(filterWithOptions.stale, true)
      assert.equal(filterWithOptions.exact, false)
      assert.deepEqual(filterWithOptions.queryKey, [
        ['users', 'show'],
        {
          request: { params: { id: '1' } },
          type: 'query',
        },
      ])

      return 'test-component'
    }

    renderHookWithWrapper(Component)
  })

  test('type inference for query filters', ({ expectTypeOf }) => {
    const { tuyau } = testContext()

    const Component = () => {
      const queryClient = useQueryClient()

      const filter = tuyau.users.show.queryFilter(
        { params: { id: '1' } },
        {
          predicate: (query) => {
            expectTypeOf(query.queryKey).toEqualTypeOf<readonly unknown[]>()
            return true
          },
        },
      )

      expectTypeOf(filter.queryKey).toMatchTypeOf<TuyauQueryKey>()

      const cachedData = queryClient.getQueryData(filter.queryKey)
      expectTypeOf(cachedData).toEqualTypeOf<{ id: string } | undefined>()

      return 'test-component'
    }

    renderHookWithWrapper(Component)
  })

  test('complex nested queryFilter', ({ assert }) => {
    const { tuyau } = testContext()

    const Component = () => {
      const nestedFilter = tuyau.posts.comments.likes.detail.queryFilter({
        params: { postId: '1', commentId: '2', likeId: '3' },
        query: { foo: 'bar' },
      })

      assert.deepEqual(nestedFilter, {
        queryKey: [
          ['posts', 'comments', 'likes', 'detail'],
          {
            request: {
              params: { postId: '1', commentId: '2', likeId: '3' },
              query: { foo: 'bar' },
            },
            type: 'query',
          },
        ],
      })

      return 'test-component'
    }

    renderHookWithWrapper(Component)
  })
})
