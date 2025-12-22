import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { setTimeout } from 'node:timers/promises'
import { useQuery, useSuspenseQuery, useMutation, skipToken } from '@tanstack/react-query'

import { defaultRegistry } from './fixtures/index.ts'
import { TuyauQueryKey } from '../src/types/common.ts'
import { createTuyauReactQueryClient } from '../src/main.ts'
import { withRequestCapture } from './helpers/request_capture.ts'
import { queryClient, renderHookWithWrapper } from './helpers/index.tsx'

test.group('Query | useQuery', () => {
  test('basic', async ({ expectTypeOf, assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/users')
      .query({ email: 'fo@ok.com' })
      .reply(200, [{ id: 1, name: 'foo' }])

    const { result } = renderHookWithWrapper(() =>
      useQuery(tuyau.users.index.queryOptions({ query: { email: 'fo@ok.com' } })),
    )

    await setTimeout(300)

    assert.deepEqual(result.current.data, [{ id: 1, name: 'foo' }])
    expectTypeOf(result.current.data).toEqualTypeOf<
      Array<{ id: number; name: string }> | undefined
    >()
  })

  test('with initial data', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'foo' })
      .reply(200, [{ id: 2, name: 'foo' }])

    const { result } = renderHookWithWrapper(() => {
      const options = tuyau.users.index.queryOptions(
        {},
        { initialData: () => [{ id: 1, name: 'initial' }] },
      )

      return useQuery(options)
    })

    const data = result.current.data
    expectTypeOf(data).toEqualTypeOf<Array<{ id: number; name: string }>>()
  })
})

test.group('Query | queryOptions', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const result = tuyau.users.index.queryOptions(
      { query: { name: 'foo' } },
      { initialData: () => [{ id: 1, name: 'foo' }], staleTime: 1000 },
    )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.staleTime, 1000)
    assert.deepEqual(result.queryKey, [
      ['users', 'index'],
      { request: { query: { name: 'foo' } }, type: 'query' },
    ])
  })

  test('with route param call', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const result = tuyau.users.show.queryOptions({ params: { id: '1' } })

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [
      ['users', 'show'],
      { request: { params: { id: '1' } }, type: 'query' },
    ])
  })
})

test.group('Query | queryKey', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const r1 = tuyau.users.index.queryKey({ query: { name: 'foo' } })
    const r2 = tuyau.users.index.queryKey()
    const r3 = tuyau.users.comments.index.queryKey({ params: { userId: '1' } })

    assert.deepEqual(r1, [
      ['users', 'index'],
      { request: { query: { name: 'foo' } }, type: 'query' },
    ])
    assert.deepEqual(r2, [['users', 'index'], { type: 'query' }])
    assert.deepEqual(r3, [
      ['users', 'comments', 'index'],
      { request: { params: { userId: '1' } }, type: 'query' },
    ])
  })
})

test.group('Query | pathKey', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const r1 = tuyau.users.pathKey()
    const r4 = tuyau.users.comments.pathKey()
    const r5 = tuyau.users.comments.index.pathKey()
    const r6 = tuyau.users.show.pathKey()

    assert.deepEqual(r1, [['users']])
    assert.deepEqual(r4, [['users', 'comments']])
    assert.deepEqual(r5, [['users', 'comments', 'index']])
    assert.deepEqual(r6, [['users', 'show']])
  })
})

test.group('Query | UseSuspenseQuery', () => {
  test('basic', async ({ expectTypeOf, assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'suspense' })
      .reply(200, [{ id: 10, name: 'suspense' }])

    const { result } = renderHookWithWrapper(() =>
      useSuspenseQuery(tuyau.users.index.queryOptions({ query: { name: 'suspense' } })),
    )

    await setTimeout(300)

    assert.deepEqual(result.current.data, [{ id: 10, name: 'suspense' }])
    expectTypeOf(result.current.data).toEqualTypeOf<Array<{ id: number; name: string }>>()
  })
})

test.group('Query | Filters', () => {
  test('queryFilter should merge filters with queryKey', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const filter = tuyau.users.index.queryFilter({ query: { name: 'foo' } }, { stale: true })

    assert.property(filter, 'queryKey')
    assert.property(filter, 'stale')
    assert.equal(filter.stale, true)
    assert.deepEqual(filter.queryKey, [
      ['users', 'index'],
      { request: { query: { name: 'foo' } }, type: 'query' },
    ])
  })

  test('pathFilter should merge filters with pathKey', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const filter = tuyau.users.pathFilter({ stale: true })

    assert.property(filter, 'queryKey')
    assert.property(filter, 'stale')
    assert.equal(filter.stale, true)
    assert.deepEqual(filter.queryKey, [['users']])
  })
})

test.group('Query | Skip Token', () => {
  test('should handle skipToken in queryOptions', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const options = tuyau.users.index.queryOptions(skipToken)

    assert.isObject(options)
    assert.property(options, 'queryKey')
    assert.equal(options.queryFn, skipToken)
  })

  test('should work with conditional queries', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    let shouldFetch = false
    const getConditionalOptions = () =>
      tuyau.users.index.queryOptions(shouldFetch ? { query: { name: 'foo' } } : skipToken)

    // Should use skipToken when condition is false
    const options1 = getConditionalOptions()
    assert.equal(options1.queryFn, skipToken)

    // Should use actual queryFn when condition is true
    shouldFetch = true
    const options2 = getConditionalOptions()
    assert.notEqual(options2.queryFn, skipToken)
    assert.isFunction(options2.queryFn)
  })
})

test.group('Query | Route Parameters', () => {
  test('should handle single route parameters', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const options = tuyau.users.show.queryOptions({ params: { id: '1' } })
    const queryKey = tuyau.users.show.queryKey({ params: { id: '1' } })

    assert.deepEqual(options.queryKey, [
      ['users', 'show'],
      { request: { params: { id: '1' } }, type: 'query' },
    ])
    assert.deepEqual(queryKey, [
      ['users', 'show'],
      { request: { params: { id: '1' } }, type: 'query' },
    ])
  })

  test('should handle nested route parameters', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const options = tuyau.posts.comments.likes.detail.queryOptions({
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    const queryKey = tuyau.posts.comments.likes.detail.queryKey({
      params: { postId: '1', commentId: '2', likeId: '3' },
      query: { foo: 'bar' },
    })

    assert.deepEqual(options.queryKey, [
      ['posts', 'comments', 'likes', 'detail'],
      {
        request: {
          params: { postId: '1', commentId: '2', likeId: '3' },
          query: { foo: 'bar' },
        },
        type: 'query',
      },
    ])
    assert.deepEqual(queryKey, options.queryKey)
  })
})

test.group('Query | CamelCase to snake_case conversion', () => {
  test('should convert camelCase route segments to snake_case for route lookup', async ({
    assert,
  }) => {
    let capturedRouteName: string | undefined

    const client = createTuyau({
      baseUrl: 'http://localhost:3333',
      registry: defaultRegistry,
    }) as any

    const originalRequest = client.request.bind(client)
    client.request = async (routeName: string, opts?: any) => {
      capturedRouteName = routeName
      return originalRequest(routeName as any, opts)
    }

    const tuyau = createTuyauReactQueryClient({ client })

    // Access using camelCase (byCategory) but route is registered as snake_case (by_category)
    // @ts-ignore tkt
    const options = tuyau.products.byCategory.queryOptions({ params: { category: 'electronics' } })

    // Execute the query function to trigger the request
    try {
      await options.queryFn!({
        queryKey: options.queryKey,
        meta: undefined,
        signal: new AbortController().signal,
        client: queryClient,
      } as any)
    } catch {
      // Ignore network errors, we just want to capture the route name
    }

    // The route name should be converted to snake_case
    assert.equal(capturedRouteName, 'products.by_category')
  })

  test('should preserve query key with camelCase segments for cache consistency', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const queryKey = tuyau.products.byCategory.queryKey({ params: { category: 'electronics' } })

    // Query key should use camelCase segments (as accessed by the user)
    assert.deepEqual(queryKey, [
      ['products', 'byCategory'],
      { request: { params: { category: 'electronics' } }, type: 'query' },
    ])
  })
})

test.group('Types | Query Types', () => {
  test('queryOptions should return correct types', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const undefinedOptions = tuyau.users.index.queryOptions({ query: { name: 'foo' } })
    expectTypeOf(undefinedOptions.queryKey).toMatchTypeOf<TuyauQueryKey>()

    const definedOptions = tuyau.users.index.queryOptions(
      { query: { name: 'foo' } },
      { initialData: () => [{ id: 1, name: 'foo' }] },
    )
    expectTypeOf(definedOptions.queryKey).toMatchTypeOf<TuyauQueryKey>()

    tuyau.users.index.queryOptions(skipToken)
  })

  test('queryKey should return TuyauQueryKey type', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const queryKey = tuyau.users.index.queryKey({ query: { name: 'foo' } })
    expectTypeOf(queryKey).toMatchTypeOf<TuyauQueryKey>()
    expectTypeOf(queryKey[0]).toMatchTypeOf<readonly string[]>()
  })

  test('pathKey should return TuyauQueryKey type', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const pathKey = tuyau.users.pathKey()
    expectTypeOf(pathKey).toMatchTypeOf<TuyauQueryKey>()
    expectTypeOf(pathKey[0]).toMatchTypeOf<readonly string[]>()
  })
})

test.group('Types | Response Extraction', () => {
  test('should extract data from status code 200/201', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'extract' })
      .reply(200, [{ id: 20, name: 'extract' }])

    const { result: queryResult } = renderHookWithWrapper(() =>
      useQuery(tuyau.users.index.queryOptions({ query: { name: 'extract' } })),
    )

    await setTimeout(300)

    assert.deepEqual(queryResult.current.data, [{ id: 20, name: 'extract' }])
    assert.isArray(queryResult.current.data)
    assert.equal(queryResult.current.data?.[0]?.id, 20)
    assert.equal(queryResult.current.data?.[0]?.name, 'extract')
  })
})

test.group('Query | Advanced Options', () => {
  test('should support custom query options', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const options = tuyau.users.index.queryOptions(
      { query: { name: 'foo' } },
      {
        staleTime: 5000,
        retry: 3,
        enabled: false,
      },
    )

    assert.equal(options.staleTime, 5000)
    assert.equal(options.retry, 3)
    assert.equal(options.enabled, false)
  })

  test('should support initialData with correct types', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const initialData = [{ id: 1, name: 'initial' }]
    const options = tuyau.users.index.queryOptions(
      { query: { name: 'foo' } },
      { initialData: () => initialData },
    )

    assert.isFunction(options.initialData)
    assert.deepEqual((options.initialData as Function)(), initialData)
  })
})

test.group('Integration | Complete Workflow', () => {
  test('should handle complete query workflow', ({ expectTypeOf, assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    // Query
    const { result: queryResult } = renderHookWithWrapper(() =>
      useQuery(tuyau.users.index.queryOptions({ query: { name: 'foo' } })),
    )

    expectTypeOf(queryResult.current.data).toEqualTypeOf<
      Array<{ id: number; name: string }> | undefined
    >()

    // Mutation
    const { result: mutationResult } = renderHookWithWrapper(() =>
      useMutation(tuyau.users.store.mutationOptions()),
    )

    mutationResult.current.mutate({ body: { name: 'foo' } })

    expectTypeOf(mutationResult.current.data).toEqualTypeOf<
      { id: number; name: string } | undefined
    >()

    // Query key
    const queryKey = tuyau.users.index.queryKey({ query: { name: 'foo' } })
    assert.deepEqual(queryKey, [
      ['users', 'index'],
      { request: { query: { name: 'foo' } }, type: 'query' },
    ])
  })
})

test.group('Query | ExtractQuery/ExtractBody endpoints', () => {
  test('should handle GET endpoints with query params', async ({ expectTypeOf, assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/products/search')
      .query({ q: 'laptop', minPrice: 100 })
      .reply(200, [{ id: 1, name: 'Laptop', price: 999 }])

    const { result } = renderHookWithWrapper(() =>
      useQuery(
        tuyau.products.search.queryOptions({
          query: { q: 'laptop', minPrice: 100 },
        }),
      ),
    )

    await setTimeout(300)

    assert.deepEqual(result.current.data, [{ id: 1, name: 'Laptop', price: 999 }])
    expectTypeOf(result.current.data).toEqualTypeOf<
      Array<{ id: number; name: string; price: number }> | undefined
    >()
  })

  test('should handle POST endpoints with body params', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .post('/products', { name: 'New Product', price: 50 })
      .reply(201, { id: 1, name: 'New Product', price: 50 })

    const { result } = renderHookWithWrapper(() =>
      useMutation(tuyau.products.create.mutationOptions()),
    )

    result.current.mutate({ body: { name: 'New Product', price: 50 } })

    expectTypeOf(result.current.data).toEqualTypeOf<
      { id: number; name: string; price: number } | undefined
    >()
  })

  test('queryKey should include query params for GET endpoints', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const queryKey = tuyau.products.search.queryKey({
      query: { q: 'laptop', category: 'electronics' },
    })

    assert.deepEqual(queryKey, [
      ['products', 'search'],
      {
        request: { query: { q: 'laptop', category: 'electronics' } },
        type: 'query',
      },
    ])
  })

  test('queryOptions should correctly type query params', ({ expectTypeOf, assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const options = tuyau.products.search.queryOptions({
      query: { q: 'test', minPrice: 10, maxPrice: 100 },
    })

    expectTypeOf(options.queryKey).toMatchTypeOf<TuyauQueryKey>()
    assert.deepEqual(options.queryKey, [
      ['products', 'search'],
      { request: { query: { q: 'test', minPrice: 10, maxPrice: 100 } }, type: 'query' },
    ])
  })
})

test.group('Query | Ky retry disabled', () => {
  test('should pass retry: 0 to disable Ky retries', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'retry-test' })
      .reply(200, [{ id: 1, name: 'retry-test' }])

    const options = tuyau.users.index.queryOptions({ query: { name: 'retry-test' } })

    await options.queryFn!({
      queryKey: options.queryKey,
      meta: undefined,
      signal: new AbortController().signal,
      client: queryClient,
    })

    assert.equal(capture.getLastRequest()?.options.retry, 0)
  })
})

test.group('Query | Ky options', () => {
  test('should pass timeout option to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'timeout-test' })
      .reply(200, [{ id: 1, name: 'timeout-test' }])

    const options = tuyau.users.index.queryOptions(
      { query: { name: 'timeout-test' } },
      { tuyau: { timeout: 60_000 } },
    )

    await options.queryFn!({
      queryKey: options.queryKey,
      meta: undefined,
      signal: new AbortController().signal,
      client: queryClient,
    })

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
      .get('/users')
      .query({ name: 'headers-test' })
      .reply(200, [{ id: 1, name: 'headers-test' }])

    const options = tuyau.users.index.queryOptions(
      { query: { name: 'headers-test' } },
      { tuyau: { headers: { 'X-Custom-Header': 'custom-value' } } },
    )

    await options.queryFn!({
      queryKey: options.queryKey,
      meta: undefined,
      signal: new AbortController().signal,
      client: queryClient,
    })

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
      .get('/users')
      .query({ name: 'multi-options-test' })
      .reply(200, [{ id: 1, name: 'multi-options-test' }])

    const options = tuyau.users.index.queryOptions(
      { query: { name: 'multi-options-test' } },
      {
        tuyau: {
          timeout: 30_000,
          headers: { Authorization: 'Bearer token123' },
          credentials: 'include',
        },
      },
    )

    await options.queryFn!({
      queryKey: options.queryKey,
      meta: undefined,
      signal: new AbortController().signal,
      client: queryClient,
    })

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
      .get('/users')
      .query({ name: 'abort-test' })
      .reply(200, [{ id: 1, name: 'abort-test' }])

    const options = tuyau.users.index.queryOptions(
      { query: { name: 'abort-test' } },
      { tuyau: { abortOnUnmount: true, timeout: 5000 } },
    )

    await options.queryFn!({
      queryKey: options.queryKey,
      meta: undefined,
      signal: new AbortController().signal,
      client: queryClient,
    })

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 5000)
    assert.notProperty(lastRequest?.options, 'abortOnUnmount')
  })
})
