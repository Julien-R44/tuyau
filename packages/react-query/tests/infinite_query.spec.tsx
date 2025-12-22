import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { waitFor, act } from '@testing-library/react'
import { useInfiniteQuery } from '@tanstack/react-query'

import { buildKey } from '../src/utils.ts'
import { defaultRegistry } from './fixtures/index.ts'
import { createTuyauReactQueryClient } from '../src/index.ts'
import { withRequestCapture } from './helpers/request_capture.ts'
import { queryClient, renderHookWithWrapper } from './helpers/index.tsx'

test.group('Infinite Query', () => {
  test('basic', async ({ assert, expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

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
    const tuyau = createTuyauReactQueryClient({ client })

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
    const tuyau = createTuyauReactQueryClient({ client })

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

    const tuyau = createTuyauReactQueryClient({ client })

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

test.group('Infinite Query | buildKey cursor/direction stripping', () => {
  test('should strip cursor and direction from query params in infinite query key', ({
    assert,
  }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: { query: { page: 1, cursor: 'abc123', direction: 'forward', limit: 10 } },
      type: 'infinite',
    })

    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { query: { page: 1, limit: 10 } }, type: 'infinite' },
    ])
  })

  test('should strip cursor and direction from body params in infinite query key', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: { body: { cursor: 'abc123', direction: 'backward', filter: 'active' } },
      type: 'infinite',
    })

    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { body: { filter: 'active' } }, type: 'infinite' },
    ])
  })

  test('should strip cursor/direction from both query and body', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: {
        query: { cursor: 'q-cursor', page: 1 },
        body: { direction: 'forward', data: 'test' },
      },
      type: 'infinite',
    })

    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { query: { page: 1 }, body: { data: 'test' } }, type: 'infinite' },
    ])
  })

  test('should not strip cursor/direction for regular queries', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: { query: { cursor: 'abc123', direction: 'forward', page: 1 } },
      type: 'query',
    })

    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { query: { cursor: 'abc123', direction: 'forward', page: 1 } }, type: 'query' },
    ])
  })

  test('should handle request without cursor/direction gracefully', ({ assert }) => {
    const key = buildKey({
      segments: ['articles', 'index'],
      request: { query: { page: 1, limit: 10 } },
      type: 'infinite',
    })

    assert.deepEqual(key, [
      ['articles', 'index'],
      { request: { query: { page: 1, limit: 10 } }, type: 'infinite' },
    ])
  })
})

test.group('Infinite Query | Ky options', (group) => {
  group.each.setup(() => queryClient.clear())

  test('should pass timeout option to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Timeout Test' }], nextCursor: null })

    const options = tuyau.articles.index.infiniteQueryOptions(
      { query: { limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        tuyau: { timeout: 60_000 },
      },
    )

    const { result } = renderHookWithWrapper(() => useInfiniteQuery(options))
    await waitFor(() => assert.isTrue(result.current.isSuccess))

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 60_000)
    assert.equal(lastRequest?.options.retry, 0)
  })

  test('should pass custom headers option to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Headers Test' }], nextCursor: null })

    const options = tuyau.articles.index.infiniteQueryOptions(
      { query: { limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        tuyau: { headers: { 'X-Custom-Header': 'custom-value' } },
      },
    )

    const { result } = renderHookWithWrapper(() => useInfiniteQuery(options))
    await waitFor(() => assert.isTrue(result.current.isSuccess))

    assert.deepEqual(capture.getLastRequest()?.options.headers, {
      'X-Custom-Header': 'custom-value',
    })
  })

  test('should pass multiple Ky options to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Multi Options Test' }], nextCursor: null })

    const options = tuyau.articles.index.infiniteQueryOptions(
      { query: { limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        tuyau: {
          timeout: 30_000,
          headers: { Authorization: 'Bearer token123' },
          credentials: 'include',
        },
      },
    )

    const { result } = renderHookWithWrapper(() => useInfiniteQuery(options))
    await waitFor(() => assert.isTrue(result.current.isSuccess))

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 30_000)
    assert.deepEqual(lastRequest?.options.headers, { Authorization: 'Bearer token123' })
    assert.equal(lastRequest?.options.credentials, 'include')
    assert.equal(lastRequest?.options.retry, 0)
  })

  test('abortOnUnmount should not be passed to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Abort Test' }], nextCursor: null })

    const options = tuyau.articles.index.infiniteQueryOptions(
      { query: { limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        tuyau: { abortOnUnmount: true, timeout: 5000 },
      },
    )

    const { result } = renderHookWithWrapper(() => useInfiniteQuery(options))
    await waitFor(() => assert.isTrue(result.current.isSuccess))

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 5000)
    assert.notProperty(lastRequest?.options, 'abortOnUnmount')
  })
})
