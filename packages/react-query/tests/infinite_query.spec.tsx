import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import { waitFor, act } from '@testing-library/react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { createTuyauReactQueryClient } from '../src/index.js'
import { ApiDefinition, queryClient, renderHookWithWrapper } from './helpers.js'

test.group('Infinite Query', () => {
  test('basic', async ({ assert, expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: 2 })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 2, limit: 10 })
      .reply(200, { data: [{ id: 2, title: 'Article 2' }], nextCursor: null })

    const options = tuyau.articles.$get.infiniteQueryOptions(
      { payload: { limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

    assert.deepEqual(options.tuyau.path, ['articles', '$get'])
    assert.equal(options.tuyau.type, 'infinite')

    const { result } = renderHookWithWrapper(() => useInfiniteQuery(options))
    await waitFor(() => {
      assert.isTrue(result.current.isSuccess)
    })

    queryClient.setQueryData(options.queryKey, (data) => {
      expectTypeOf<typeof data>(result.current.data)
      return data
    })

    const queryData = queryClient.getQueryData(
      tuyau.articles.$get.infiniteQueryKey({ payload: { limit: 10 } }),
    )!
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
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: 2 })

    const options = tuyau.articles.$get.infiniteQueryOptions(
      { payload: { limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

    assert.deepEqual(options.queryKey, [
      ['articles', '$get'],
      { payload: { limit: 10 }, type: 'infinite' },
    ])

    assert.deepEqual(
      options.queryKey,
      tuyau.articles.$get.infiniteQueryKey({ payload: { limit: 10 } }),
    )
  })

  test('typings', async ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: 2 })

    tuyau.articles.$get.infiniteQueryOptions(
      { payload: { limit: 10 } },
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
})
