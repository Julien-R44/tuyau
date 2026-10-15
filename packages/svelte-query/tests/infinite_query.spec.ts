import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { InfiniteQueryObserver, QueryClient, skipToken } from '@tanstack/query-core'
import type { InfiniteData } from '@tanstack/query-core'

import { defaultRegistry } from './fixtures/index.ts'
import { createTuyauSvelteQueryClient } from '../src/index.ts'
import { withRequestCapture } from '@tuyau/query-core/test-helpers'

test.group('Infinite Query', () => {
  test('initial data and cache retain pages when select transforms the result', ({
    assert,
    expectTypeOf,
  }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauSvelteQueryClient({ client })
    const initialData = {
      pages: [{ data: [{ id: 7, title: 'First' }], nextCursor: null }],
      pageParams: [1],
    }
    const options = [
      tuyau.articles.index.infiniteQueryOptions(
        {},
        {
          enabled: false,
          initialPageParam: 1,
          getNextPageParam: (page) => page.nextCursor,
          select: (data) => data.pages.flatMap((page) => page.data.map((article) => article.title)),
        },
      ),
      tuyau.articles.index.infiniteQueryOptions(
        {},
        {
          enabled: false,
          initialData,
          initialPageParam: 1,
          getNextPageParam: (page) => page.nextCursor,
          select: (data) => data.pages.flatMap((page) => page.data.map((article) => article.title)),
        },
      ),
      tuyau.articles.index.infiniteQueryOptions(
        {},
        {
          enabled: false,
          initialData: () => initialData,
          initialPageParam: 1,
          getNextPageParam: (page) => page.nextCursor,
          select: (data) => data.pages.flatMap((page) => page.data.map((article) => article.title)),
        },
      ),
    ]

    for (const option of options) {
      const cache = new QueryClient()
      if (!option.initialData) {
        cache.setQueryData(tuyau.articles.index.infiniteQueryKey({}), initialData)
      }
      const observer = new InfiniteQueryObserver(cache, option)
      const selected = observer.getCurrentResult().data
      const cached = cache.getQueryData(option.queryKey)

      expectTypeOf(selected).toEqualTypeOf<string[] | undefined>()
      expectTypeOf(cached).toEqualTypeOf<
        | InfiniteData<{
            data: Array<{ id: number; title: string }>
            nextCursor: number | null
          }>
        | undefined
      >()
      assert.deepEqual(selected, ['First'])
      assert.deepEqual(cached, initialData)
      observer.destroy()
      cache.clear()
    }
  })

  test('query keys', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauSvelteQueryClient({ client })

    const options: any = tuyau.articles.index.infiniteQueryOptions(
      { query: { page: 1, limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
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

  test('should have queryFn as a function', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauSvelteQueryClient({ client })

    const options: any = tuyau.articles.index.infiniteQueryOptions(
      { query: { page: 1, limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      },
    )

    assert.isFunction(options.queryFn)
  })

  test('should have default initialPageParam and getNextPageParam', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauSvelteQueryClient({ client })

    const options: any = tuyau.articles.index.infiniteQueryOptions(
      { query: { limit: 10 } },
      {} as any,
    )

    assert.equal(options.initialPageParam, 1)
    assert.isFunction(options.getNextPageParam)
    assert.isNull(options.getNextPageParam())
  })
})

test.group('Infinite Query | skipToken', () => {
  test('should handle skipToken in infiniteQueryOptions', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauSvelteQueryClient({ client })

    const options: any = tuyau.articles.index.infiniteQueryOptions(skipToken, {
      pageParamKey: 'page',
      initialPageParam: 1,
      getNextPageParam: () => null,
    })

    assert.isObject(options)
    assert.property(options, 'queryKey')
    assert.equal(typeof options.queryFn, 'symbol')
  })

  test('should work with conditional infinite queries', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauSvelteQueryClient({ client })

    let shouldFetch = false
    const getConditionalOptions = () =>
      tuyau.articles.index.infiniteQueryOptions(
        shouldFetch ? { query: { page: 1, limit: 10 } } : skipToken,
        {
          pageParamKey: 'page',
          initialPageParam: 1,
          getNextPageParam: () => null,
        },
      )

    const options1: any = getConditionalOptions()
    assert.equal(typeof options1.queryFn, 'symbol')

    shouldFetch = true
    const options2: any = getConditionalOptions()
    assert.notEqual(typeof options2.queryFn, 'symbol')
    assert.isFunction(options2.queryFn)
  })
})

test.group('Infinite Query | Ky options', () => {
  test('should pass timeout option to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauSvelteQueryClient({ client })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Timeout Test' }], nextCursor: null })

    const options: any = tuyau.articles.index.infiniteQueryOptions(
      { query: { limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        tuyau: { timeout: 60_000 },
      },
    )

    await options.queryFn!({
      queryKey: options.queryKey,
      meta: undefined,
      signal: new AbortController().signal,
      pageParam: 1,
    })

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 60_000)
    assert.equal(lastRequest?.options.retry, 0)
  })

  test('abortOnUnmount should not be passed to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauSvelteQueryClient({ client })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Abort Test' }], nextCursor: null })

    const options: any = tuyau.articles.index.infiniteQueryOptions(
      { query: { limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        tuyau: { abortOnUnmount: true, timeout: 5000 },
      },
    )

    await options.queryFn!({
      queryKey: options.queryKey,
      meta: undefined,
      signal: new AbortController().signal,
      pageParam: 1,
    })

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 5000)
    assert.notProperty(lastRequest?.options, 'abortOnUnmount')
  })
})
