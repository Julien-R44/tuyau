import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { waitFor, act } from '@testing-library/react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { defaultRegistry } from './fixtures/index.ts'
import { createTuyauReactQueryClient } from '../src/index.ts'
import { queryClient, renderHookWithWrapper } from './helpers/index.tsx'

test.group('Infinite Query', () => {
  test('basic', async ({ assert, expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: 2 })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 2, limit: 10 })
      .reply(200, { data: [{ id: 2, title: 'Article 2' }], nextCursor: null })

    const options = tuyau.articles.index.infiniteQueryOptions(
      { query: { page: 1, limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

    const { result } = renderHookWithWrapper(() => useInfiniteQuery(options))
    await waitFor(() => {
      assert.isTrue(result.current.isSuccess)
    })

    queryClient.setQueryData(options.queryKey, (data) => {
      expectTypeOf<typeof data>(result.current.data)
      return data
    })

    const queryData = queryClient.getQueryData(
      tuyau.articles.index.infiniteQueryKey({ query: { page: 1, limit: 10 } }),
    )
    expectTypeOf<typeof result.current.data>(queryData)
    assert.deepEqual(result.current.data, queryData)

    assert.lengthOf(result.current.data!.pages, 1)
    assert.equal(result.current.data!.pages[0].data[0].title, 'Article 1')
    assert.isTrue(result.current.hasNextPage)

    await act(async () => await result.current.fetchNextPage())
    await waitFor(() => assert.lengthOf(result.current.data!.pages, 2))

    assert.equal(result.current.data!.pages[0].data[0].title, 'Article 1')
    assert.equal(result.current.data!.pages[1].data[0].title, 'Article 2')
    assert.isFalse(result.current.hasNextPage)
  })

  test('query keys', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: 2 })

    const options = tuyau.articles.index.infiniteQueryOptions(
      { query: { page: 1, limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

    assert.deepEqual(options.queryKey, [
      ['articles', 'index'],
      { request: { query: { page: 1, limit: 10 } }, type: 'infinite' },
    ])

    assert.deepEqual(
      options.queryKey,
      tuyau.articles.index.infiniteQueryKey({ query: { page: 1, limit: 10 } }),
    )
  })

  test('typings', async ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: 2 })

    tuyau.articles.index.infiniteQueryOptions(
      { query: { page: 1, limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          expectTypeOf(lastPage).toEqualTypeOf<{
            data: { id: number; title: string }[]
            nextCursor: number | null
          }>()

          return lastPage.nextCursor
        },
      },
    )
  })

  test('should pass retry: 0 to disable Ky retries', async ({ assert }) => {
    let capturedOptions: any

    const client = createTuyau({
      baseUrl: 'http://localhost:3333',
      registry: defaultRegistry,
    })

    const originalRequest = client.request.bind(client)
    client.request = async (routeName: string, opts?: any) => {
      capturedOptions = opts
      return originalRequest(routeName as any, opts)
    }

    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: null })

    const options = tuyau.articles.index.infiniteQueryOptions(
      { query: { page: 1, limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

    const { result } = renderHookWithWrapper(() => useInfiniteQuery(options))
    await waitFor(() => assert.isTrue(result.current.isSuccess))

    assert.equal(capturedOptions.retry, 0)
  })
})
