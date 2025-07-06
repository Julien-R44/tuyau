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
      { payload: { name: 'foo' }, type: 'infinite' },
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
    assert.deepEqual(result.queryKey, [['users', ':id', '$get'], { payload: {}, type: 'infinite' }])
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
      ['users', ':id', '$get'],
      { payload: {}, params: { id: 23 }, type: 'infinite' },
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

    assert.deepEqual(r1, [['users', '$get'], { payload: { name: 'foo' }, type: 'infinite' }])
    assert.deepEqual(r2, [['users', '$get'], { type: 'infinite' }])
    assert.deepEqual(r3, [['users', ':id', 'comments', '$get'], { type: 'infinite' }])
    assert.deepEqual(r4, [
      ['users', ':id', 'comments', '$get'],
      { params: { id: 42 }, type: 'infinite' },
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
      { payload: { name: 'foo' }, type: 'infinite' },
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
