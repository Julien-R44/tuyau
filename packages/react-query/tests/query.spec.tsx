import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import { setTimeout } from 'node:timers/promises'
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  skipToken,
  QueryClient,
} from '@tanstack/react-query'

import { TuyauQueryKey } from '../src/types.js'
import { createTuyauReactQueryClient } from '../src/index.js'
import { ApiDefinition, queryClient, renderHookWithWrapper } from './helpers.jsx'

test.group('Query | useQuery', () => {
  test('basic', async ({ expectTypeOf, assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'foo' })
      .reply(200, [{ id: 1, name: 'foo' }])

    const { result } = renderHookWithWrapper(() =>
      useQuery(tuyau.users.$get.queryOptions({ payload: { name: 'foo' } })),
    )

    await setTimeout(300)

    assert.deepEqual(result.current.data, [{ id: 1, name: 'foo' }])
    expectTypeOf(result.current.data).toEqualTypeOf<
      Array<{ id: number; name: string }> | undefined
    >()
  })

  test('with initial data', ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'foo' })
      .reply(200, [{ id: 2, name: 'foo' }])

    const { result } = renderHookWithWrapper(() => {
      const options = tuyau.users.$get.queryOptions(
        { payload: { name: 'foo' } },
        { initialData: () => [{ id: 1, name: 'foo' }] },
      )

      return useQuery(options)
    })

    const data = result.current.data
    expectTypeOf(data).toEqualTypeOf<Array<{ id: number; name: string }>>()
  })
})

test.group('Query | queryOptions', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.queryOptions(
      { payload: { name: 'foo' } },
      { initialData: () => [{ id: 1, name: 'foo' }], staleTime: 1000 },
    )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.staleTime, 1000)
    assert.deepEqual(result.queryKey, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'query' },
    ])
  })

  test('with route param call', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users({ id: 1 }).$get.queryOptions({ payload: {} })

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [
      ['users', '1', '$get'],
      { input: { payload: {} }, type: 'query' },
    ])
  })

  test('with null route param call', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users[':id'].$get.queryOptions({ payload: {}, params: { id: 23 } })

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [
      ['users', '23', '$get'],
      { input: { payload: {}, params: { id: 23 } }, type: 'query' },
    ])
  })
})

test.group('Query | queryKey', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const r1 = tuyau.users.$get.queryKey({ payload: { name: 'foo' } })
    const r2 = tuyau.users.$get.queryKey()
    const r3 = tuyau.users({ id: 1 }).comments.$get.queryKey()

    assert.deepEqual(r1, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'query' },
    ])
    assert.deepEqual(r2, [['users', '$get'], { type: 'query' }])
    assert.deepEqual(r3, [['users', '1', 'comments', '$get'], { type: 'query' }])
  })
})

test.group('Query | pathKey', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const r1 = tuyau.users.pathKey()
    const r2 = tuyau.users.$get.pathKey()
    const r3 = tuyau.users.pathKey()
    const r4 = tuyau.users({ id: 1 }).pathKey()
    const r5 = tuyau.users({ id: 1 }).comments.pathKey()

    assert.deepEqual(r1, [['users']])
    assert.deepEqual(r2, [['users', '$get']])
    assert.deepEqual(r3, [['users']])
    assert.deepEqual(r4, [['users', '1']])
    assert.deepEqual(r5, [['users', '1', 'comments']])
  })
})

test.group('Query | UseSuspenseQuery', () => {
  test('basic', async ({ expectTypeOf, assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'suspense' })
      .reply(200, [{ id: 10, name: 'suspense' }])

    const { result } = renderHookWithWrapper(() =>
      useSuspenseQuery(tuyau.users.$get.queryOptions({ payload: { name: 'suspense' } })),
    )

    await setTimeout(300)

    assert.deepEqual(result.current.data, [{ id: 10, name: 'suspense' }])
    expectTypeOf(result.current.data).toEqualTypeOf<Array<{ id: number; name: string }>>()
  })
})

test.group('Query | Filters', () => {
  test('queryFilter should merge filters with queryKey', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const filter = tuyau.users.$get.queryFilter({ payload: { name: 'foo' } }, { stale: true })

    assert.property(filter, 'queryKey')
    assert.property(filter, 'stale')
    assert.equal(filter.stale, true)
    assert.deepEqual(filter.queryKey, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'query' },
    ])
  })

  test('pathFilter should merge filters with pathKey', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const filter = tuyau.users.pathFilter({ stale: true })

    assert.property(filter, 'queryKey')
    assert.property(filter, 'stale')
    assert.equal(filter.stale, true)
    assert.deepEqual(filter.queryKey, [['users']])
  })
})

test.group('Query | Skip Token', () => {
  test('should handle skipToken in queryOptions', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users.$get.queryOptions(skipToken)

    assert.isObject(options)
    assert.property(options, 'queryKey')
    assert.equal(options.queryFn, skipToken)
  })

  test('should work with conditional queries', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    let shouldFetch = false
    const getConditionalOptions = () =>
      tuyau.users.$get.queryOptions(shouldFetch ? { payload: { name: 'foo' } } : skipToken)

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

test.group('Query | Lazy QueryClient', () => {
  test('should support lazy queryClient initialization', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const lazyQueryClient = () => new QueryClient()
    const tuyau = createTuyauReactQueryClient({ client, queryClient: lazyQueryClient })

    const options = tuyau.users.$get.queryOptions({ payload: { name: 'foo' } })

    assert.isObject(options)
    assert.property(options, 'queryKey')
    assert.property(options, 'queryFn')
  })
})

test.group('Query | Route Parameters', () => {
  test('should handle single route parameters', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users({ id: 1 }).$get.queryOptions({ payload: {} })
    const queryKey = tuyau.users({ id: 1 }).$get.queryKey({ payload: {} })
    const pathKey = tuyau.users({ id: 1 }).pathKey()

    assert.deepEqual(options.queryKey, [
      ['users', '1', '$get'],
      { input: { payload: {} }, type: 'query' },
    ])
    assert.deepEqual(queryKey, [['users', '1', '$get'], { input: { payload: {} }, type: 'query' }])
    assert.deepEqual(pathKey, [['users', '1']])
  })

  test('should handle nested route parameters', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau
      .users({ id: 1 })
      .comments({ comment_id: 2 })
      .$get.queryOptions({ payload: {} })
    const queryKey = tuyau
      .users({ id: 1 })
      .comments({ comment_id: 2 })
      .$get.queryKey({ payload: {} })

    assert.deepEqual(options.queryKey, [
      ['users', '1', 'comments', '2', '$get'],
      { input: { payload: {} }, type: 'query' },
    ])
    assert.deepEqual(queryKey, [
      ['users', '1', 'comments', '2', '$get'],
      { input: { payload: {} }, type: 'query' },
    ])
  })
})

test.group('Types | Query Types', () => {
  test('queryOptions should return correct types', ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const undefinedOptions = tuyau.users.$get.queryOptions({ payload: { name: 'foo' } })
    expectTypeOf(undefinedOptions.queryKey).toMatchTypeOf<TuyauQueryKey>()

    const definedOptions = tuyau.users.$get.queryOptions(
      { payload: { name: 'foo' } },
      { initialData: () => [{ id: 1, name: 'foo' }] },
    )
    expectTypeOf(definedOptions.queryKey).toMatchTypeOf<TuyauQueryKey>()

    tuyau.users.$get.queryOptions(skipToken)
  })

  test('queryKey should return TuyauQueryKey type', ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const queryKey = tuyau.users.$get.queryKey({ payload: { name: 'foo' } })
    expectTypeOf(queryKey).toMatchTypeOf<TuyauQueryKey>()
    expectTypeOf(queryKey[0]).toMatchTypeOf<readonly string[]>()
  })

  test('pathKey should return TuyauQueryKey type', ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const pathKey = tuyau.users.pathKey()
    expectTypeOf(pathKey).toMatchTypeOf<TuyauQueryKey>()
    expectTypeOf(pathKey[0]).toMatchTypeOf<readonly string[]>()
  })
})

test.group('Types | Response Extraction', () => {
  test('should extract data from status code 200/201', async ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'extract' })
      .reply(200, [{ id: 20, name: 'extract' }])

    const { result: queryResult } = renderHookWithWrapper(() =>
      useQuery(tuyau.users.$get.queryOptions({ payload: { name: 'extract' } })),
    )

    await setTimeout(300)

    assert.deepEqual(queryResult.current.data, [{ id: 20, name: 'extract' }])
    assert.isArray(queryResult.current.data)
    assert.equal(queryResult.current.data?.[0]?.id, 20)
    assert.equal(queryResult.current.data?.[0]?.name, 'extract')
  })
})

test.group('Error Handling', () => {
  test('should throw error for unknown methods', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    assert.throws(
      () => (tuyau.users as any).unknownMethod(),
      'Method unknownMethod not found on Tuyau client',
    )
  })
})

test.group('Query | Advanced Options', () => {
  test('should support custom query options', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users.$get.queryOptions(
      { payload: { name: 'foo' } },
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
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const initialData = [{ id: 1, name: 'initial' }]
    const options = tuyau.users.$get.queryOptions(
      { payload: { name: 'foo' } },
      { initialData: () => initialData },
    )

    assert.isFunction(options.initialData)
    assert.deepEqual((options.initialData as Function)(), initialData)
  })
})

test.group('Query | Complex Scenarios', () => {
  test('should work with conditional queries using skipToken', async ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    let shouldFetch = false
    const { result, rerender } = renderHookWithWrapper(() => {
      const options = tuyau.users.$get.queryOptions(
        shouldFetch ? { payload: { name: 'foo' } } : skipToken,
      )
      return useQuery(options)
    })

    assert.equal(result.current.isLoading, false)
    assert.equal(result.current.fetchStatus, 'idle')

    shouldFetch = true
    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'foo' })
      .reply(200, [{ id: 1, name: 'foo' }])

    rerender()
    await setTimeout(300)

    assert.equal(result.current.isSuccess, true)
    assert.deepEqual(result.current.data, [{ id: 1, name: 'foo' }])
  })

  test('should handle deeply nested route parameters', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const nestedQueryKey = tuyau
      .users({ id: 1 })
      .comments({ comment_id: 2 })
      .$get.queryKey({ payload: {} })
    assert.deepEqual(nestedQueryKey, [
      ['users', '1', 'comments', '2', '$get'],
      { input: { payload: {} }, type: 'query' },
    ])
  })
})

test.group('Mutation | Advanced Options', () => {
  test('should support custom mutation options', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const onSuccess = () => {}
    const onError = () => {}

    const options = tuyau.users.$post.mutationOptions({
      onSuccess,
      onError,
      retry: 2,
    })

    // The onSuccess function is wrapped, so we can't directly compare functions
    // Instead, we check that the properties exist and are functions
    assert.isFunction(options.onSuccess)
    assert.equal(options.onError, onError)
    assert.equal(options.retry, 2)
  })
})

test.group('Integration | Complete Workflow', () => {
  test('should work end-to-end with real React Query hooks', async ({ assert, expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'foo' })
      .reply(200, [{ id: 1, name: 'foo' }])

    nock('http://localhost:3333').post('/users').reply(201, { id: 2, name: 'bar' })

    const { result: queryResult } = renderHookWithWrapper(() =>
      useQuery(tuyau.users.$get.queryOptions({ payload: { name: 'foo' } })),
    )

    await setTimeout(300)

    assert.equal(queryResult.current.isSuccess, true)
    assert.deepEqual(queryResult.current.data, [{ id: 1, name: 'foo' }])

    expectTypeOf(queryResult.current.data).toEqualTypeOf<
      Array<{ id: number; name: string }> | undefined
    >()

    const { result: mutationResult } = renderHookWithWrapper(() =>
      useMutation(tuyau.users.$post.mutationOptions()),
    )

    mutationResult.current.mutate({ payload: { name: 'bar' } })
    await setTimeout(300)

    assert.equal(mutationResult.current.isSuccess, true)
    assert.deepEqual(mutationResult.current.data, { id: 2, name: 'bar' })

    expectTypeOf(mutationResult.current.data).toEqualTypeOf<
      { id: number; name: string } | undefined
    >()
  })
})
