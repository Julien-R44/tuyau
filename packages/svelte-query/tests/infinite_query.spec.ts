import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { skipToken } from '@tanstack/query-core'

import { defaultRegistry } from './fixtures/index.ts'
import { createTuyauSvelteQueryClient } from '../src/index.ts'
import { withRequestCapture } from '@tuyau/query-core/test-helpers'

test.group('Infinite Query', () => {
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
