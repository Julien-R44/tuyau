import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { setTimeout } from 'node:timers/promises'
import { useInfiniteQuery, skipToken } from '@tanstack/vue-query'
import { toValue } from 'vue'

import { defaultRegistry } from './fixtures/index.ts'
import { createTuyauVueQueryClient } from '../src/index.ts'
import { withRequestCapture } from '@tuyau/query-core/test-helpers'
import { queryClient, renderComposable, flushPromises } from './helpers/index.ts'

test.group('Infinite Query', (group) => {
  group.each.setup(() => queryClient.clear())

  test('basic', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: 2 })

    const options: any = tuyau.articles.index.infiniteQueryOptions(
      { query: { page: 1, limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      },
    )

    const { result, wrapper } = renderComposable(() => useInfiniteQuery(options))

    await flushPromises()
    await setTimeout(300)

    const data: any = toValue(result.data)
    assert.isTrue(toValue(result.isSuccess))
    assert.lengthOf(data!.pages, 1)
    assert.equal(data!.pages[0].data[0].title, 'Article 1')
    wrapper.unmount()
  })

  test('query keys', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

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

  test('should pass retry: 0 to disable Ky retries', async ({ assert }) => {
    let capturedOptions: any

    const client = createTuyau({
      baseUrl: 'http://localhost:3333',
      registry: defaultRegistry,
    })

    const originalRequest = client.request.bind(client)
    client.request = ((routeName: string, opts?: any) => {
      capturedOptions = opts
      return originalRequest(routeName as any, opts)
    }) as typeof client.request

    const tuyau = createTuyauVueQueryClient({ client })

    nock('http://localhost:3333')
      .get('/articles')
      .query({ page: 1, limit: 10 })
      .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: null })

    const options: any = tuyau.articles.index.infiniteQueryOptions(
      { query: { page: 1, limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      },
    )

    const { result, wrapper } = renderComposable(() => useInfiniteQuery(options))

    await flushPromises()
    await setTimeout(300)

    assert.isTrue(toValue(result.isSuccess))
    assert.equal(capturedOptions.retry, 0)
    wrapper.unmount()
  })
})

test.group('Infinite Query | skipToken', (group) => {
  group.each.setup(() => queryClient.clear())

  test('should handle skipToken in infiniteQueryOptions', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

    const options: any = tuyau.articles.index.infiniteQueryOptions(skipToken, {
      pageParamKey: 'page',
      initialPageParam: 1,
      getNextPageParam: () => null,
    })

    assert.isObject(options)
    assert.property(options, 'queryKey')
    assert.equal(options.queryFn, skipToken)
  })

  test('should work with conditional infinite queries', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

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
    assert.equal(options1.queryFn, skipToken)

    shouldFetch = true
    const options2: any = getConditionalOptions()
    assert.notEqual(options2.queryFn, skipToken)
    assert.isFunction(options2.queryFn)
  })

  test('useInfiniteQuery should not fetch when using skipToken', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

    const options: any = tuyau.articles.index.infiniteQueryOptions(skipToken, {
      pageParamKey: 'page',
      initialPageParam: 1,
      getNextPageParam: () => null,
    })

    const { result, wrapper } = renderComposable(() => useInfiniteQuery(options))

    assert.isTrue(toValue(result.isPending))
    assert.isFalse(toValue(result.isFetching))
    assert.isUndefined(toValue(result.data))
    wrapper.unmount()
  })
})

test.group('Infinite Query | Ky options', (group) => {
  group.each.setup(() => queryClient.clear())

  test('should pass timeout option to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauVueQueryClient({ client })

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

    const { result, wrapper } = renderComposable(() => useInfiniteQuery(options))

    await flushPromises()
    await setTimeout(300)

    assert.isTrue(toValue(result.isSuccess))
    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 60_000)
    assert.equal(lastRequest?.options.retry, 0)
    wrapper.unmount()
  })

  test('abortOnUnmount should not be passed to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauVueQueryClient({ client })

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

    const { result, wrapper } = renderComposable(() => useInfiniteQuery(options))

    await flushPromises()
    await setTimeout(300)

    assert.isTrue(toValue(result.isSuccess))
    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 5000)
    assert.notProperty(lastRequest?.options, 'abortOnUnmount')
    wrapper.unmount()
  })
})
