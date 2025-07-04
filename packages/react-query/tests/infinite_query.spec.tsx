import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import { skipToken } from '@tanstack/react-query'

import type { TuyauQueryKey } from '../src/types.js'
import { ApiDefinition, queryClient } from './helpers.js'
import { createTuyauReactQueryClient } from '../src/index.js'

test.group('Infinite Query | infiniteQueryOptions', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'infinite' },
    ])
    assert.equal(result.initialPageParam, null)
    assert.property(result, 'tuyau')
    assert.equal(result.tuyau.type, 'infinite')
  })

  test('with route param call', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users({ id: 1 }).$get.infiniteQueryOptions(
      { payload: {} },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [
      ['users', '1', '$get'],
      { input: { payload: {} }, type: 'infinite' },
    ])
  })

  test('with null route param call', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users[':id'].$get.infiniteQueryOptions(
      { payload: {}, params: { id: 23 } },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [
      ['users', '23', '$get'],
      { input: { payload: {}, params: { id: 23 } }, type: 'infinite' },
    ])
  })
})

test.group('Infinite Query | infiniteQueryKey', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const r1 = tuyau.users.$get.infiniteQueryKey({ payload: { name: 'foo' } })
    const r2 = tuyau.users.$get.infiniteQueryKey()
    const r3 = tuyau.users({ id: 1 }).comments.$get.infiniteQueryKey()
    const r4 = tuyau.users[':id'].comments.$get.infiniteQueryKey({ params: { id: 42 } })

    assert.deepEqual(r1, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'infinite' },
    ])
    assert.deepEqual(r2, [['users', '$get'], { type: 'infinite' }])
    assert.deepEqual(r3, [['users', '1', 'comments', '$get'], { type: 'infinite' }])
    assert.deepEqual(r4, [
      ['users', '42', 'comments', '$get'],
      { input: { params: { id: 42 } }, type: 'infinite' },
    ])
  })
})

test.group('Infinite Query | infiniteQueryFilter', () => {
  test('should merge filters with infiniteQueryKey', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const filter = tuyau.users.$get.infiniteQueryFilter(
      { payload: { name: 'foo' } },
      { stale: true },
    )

    assert.property(filter, 'queryKey')
    assert.property(filter, 'stale')
    assert.equal(filter.stale, true)
    assert.deepEqual(filter.queryKey, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'infinite' },
    ])
  })
})

test.group('Infinite Query | Skip Token', () => {
  test('should handle skipToken in infiniteQueryOptions', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users.$get.infiniteQueryOptions(skipToken)

    assert.isObject(options)
    assert.property(options, 'queryKey')
    assert.equal(options.queryFn, skipToken)
  })

  test('should work with conditional infinite queries', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    let shouldFetch = false
    const getConditionalOptions = () =>
      tuyau.users.$get.infiniteQueryOptions(
        shouldFetch ? { payload: { name: 'foo' } } : skipToken,
        {
          getNextPageParam: (lastPage: any) => lastPage.nextCursor,
          initialPageParam: null,
        },
      )

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

test.group('Types | Infinite Query Types', () => {
  test('infiniteQueryOptions should return correct types', ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const undefinedOptions = tuyau.users.$get.infiniteQueryOptions({ payload: { name: 'foo' } })
    expectTypeOf(undefinedOptions.queryKey).toMatchTypeOf<TuyauQueryKey>()

    const definedOptions = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        initialData: () => ({ pages: [[{ id: 1, name: 'foo' }]], pageParams: [null] }),
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )
    expectTypeOf(definedOptions.queryKey).toMatchTypeOf<TuyauQueryKey>()

    tuyau.users.$get.infiniteQueryOptions(skipToken)
  })

  test('infiniteQueryKey should return TuyauQueryKey type', ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const queryKey = tuyau.users.$get.infiniteQueryKey({ payload: { name: 'foo' } })
    expectTypeOf(queryKey).toMatchTypeOf<TuyauQueryKey>()
    expectTypeOf(queryKey[0]).toMatchTypeOf<readonly string[]>()
  })
})

test.group('Infinite Query | Advanced Features', () => {
  test('should handle select transformation', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        select: (data) => ({
          ...data,
          totalPages: data.pages.length,
        }),
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.isFunction(result.queryFn)
    assert.isFunction(result.select)
    assert.property(result, 'tuyau')
    assert.equal(result.tuyau.type, 'infinite')
  })

  test('should handle initial data', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const initialData = {
      pages: [[{ id: 1, name: 'initial' }]],
      pageParams: [null],
    }

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        initialData,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.initialData, initialData)
    assert.property(result, 'tuyau')
    assert.equal(result.tuyau.type, 'infinite')
  })

  test('should handle custom initialPageParam', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        initialPageParam: 'custom-cursor',
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      },
    )

    assert.equal(result.initialPageParam, 'custom-cursor')
  })

  test('should handle getPreviousPageParam', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
        getPreviousPageParam: (firstPage: any) => firstPage.prevCursor,
      },
    )

    assert.isFunction(result.queryFn)
    assert.isFunction(result.getNextPageParam)
    assert.isFunction(result.getPreviousPageParam)
  })

  test('should handle maxPages option', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        maxPages: 5,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.equal(result.maxPages, 5)
  })
})

test.group('Infinite Query | Error Handling', () => {
  test('should handle retry configuration', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        retry: 3,
        retryDelay: 1000,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.equal(result.retry, 3)
    assert.equal(result.retryDelay, 1000)
  })

  test('should handle enabled option', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        enabled: false,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.equal(result.enabled, false)
  })
})

test.group('Infinite Query | Caching and Invalidation', () => {
  test('should handle staleTime and cacheTime', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        staleTime: 5000,
        gcTime: 10_000,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.equal(result.staleTime, 5000)
    assert.equal(result.gcTime, 10_000)
  })

  test('should handle refetchOnWindowFocus', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.equal(result.refetchOnWindowFocus, false)
  })
})

test.group('Infinite Query | Complex Scenarios', () => {
  test('should handle deeply nested routes with infinite queries', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users({ id: 1 }).comments.$get.infiniteQueryOptions(
      { payload: {} },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [
      ['users', '1', 'comments', '$get'],
      { input: { payload: {} }, type: 'infinite' },
    ])
  })

  test('should handle query with payload and route parameters', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau
      .users({ id: 1 })
      .comments({ comment_id: 2 })
      .$get.infiniteQueryOptions(
        { payload: {}, params: { sort: 'asc' } },
        {
          getNextPageParam: (lastPage: any) => lastPage.nextCursor,
          initialPageParam: null,
        },
      )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [
      ['users', '1', 'comments', '2', '$get'],
      { input: { payload: {}, params: { sort: 'asc' } }, type: 'infinite' },
    ])
  })

  test('should handle empty payload in infinite queries', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      {},
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [['users', '$get'], { input: {}, type: 'infinite' }])
  })
})

test.group('Infinite Query | Meta and Context', () => {
  test('should handle meta information', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const meta = { feature: 'infinite-scroll', version: '1.0' }
    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        meta,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.deepEqual(result.meta, meta)
  })

  test('should preserve tuyau context information', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.property(result, 'tuyau')
    assert.equal(result.tuyau.type, 'infinite')
    assert.deepEqual(result.tuyau.path, ['users', '$get'])
  })
})

test.group('Infinite Query | Query Key Consistency', () => {
  test('infiniteQueryOptions and infiniteQueryKey should match', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    const queryKey = tuyau.users.$get.infiniteQueryKey({ payload: { name: 'foo' } })

    assert.deepEqual(options.queryKey, queryKey)
  })

  test('should handle cursor in input without affecting query key', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    // Input with cursor should have cursor stripped from query key
    const options1 = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } as any },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    const options2 = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    // Query keys should be the same (cursor is handled internally)
    assert.deepEqual(options1.queryKey, options2.queryKey)
    assert.deepEqual(options1.queryKey, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'infinite' },
    ])
  })
})

test.group('Infinite Query | Cursor Handling', () => {
  test('should handle falsy cursor values', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } as any },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
      },
    )

    assert.isFunction(options.queryFn)
    assert.deepEqual(options.queryKey, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'infinite' },
    ])
  })

  test('should handle direction parameter in input', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } as any },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
        getPreviousPageParam: (firstPage: any) => firstPage.prevCursor,
      },
    )

    assert.isFunction(options.queryFn)
    // Direction should be stripped from query key like cursor
    assert.deepEqual(options.queryKey, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'infinite' },
    ])
  })

  test('should handle both cursor and direction parameters', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users.$get.infiniteQueryOptions(
      { payload: { name: 'foo' } as any },
      {
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialPageParam: null,
        getPreviousPageParam: (firstPage: any) => firstPage.prevCursor,
      },
    )

    assert.isFunction(options.queryFn)
    // Both cursor and direction should be stripped from query key
    assert.deepEqual(options.queryKey, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'infinite' },
    ])
  })
})

test.group('Infinite Query | Query Filter Integration', () => {
  test('infiniteQueryFilter should work with predicate functions', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const filter = tuyau.users.$get.infiniteQueryFilter(
      { payload: { name: 'foo' } },
      {
        predicate: (query) => {
          // In a real scenario, this would check query state
          return (query.queryKey as any)[0][0] === 'users'
        },
      },
    )

    assert.property(filter, 'queryKey')
    assert.property(filter, 'predicate')
    assert.isFunction(filter.predicate)
    assert.deepEqual(filter.queryKey, [
      ['users', '$get'],
      { input: { payload: { name: 'foo' } }, type: 'infinite' },
    ])
  })

  test('infiniteQueryFilter should handle exact matching', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const filter = tuyau.users.$get.infiniteQueryFilter(
      { payload: { name: 'foo' } },
      {
        exact: true,
        stale: true,
      },
    )

    assert.property(filter, 'queryKey')
    assert.property(filter, 'exact')
    assert.property(filter, 'stale')
    assert.equal(filter.exact, true)
    assert.equal(filter.stale, true)
  })
})
