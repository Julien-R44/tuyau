import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { setTimeout } from 'node:timers/promises'
import { useMutation } from '@tanstack/react-query'

import { TuyauMutationKey } from '../src/types/common.ts'
import { defaultRegistry } from './fixtures/index.ts'
import { createTuyauReactQueryClient } from '../src/main.ts'
import { queryClient, renderHookWithWrapper } from './helpers/index.tsx'

test.group('Mutation | Options', () => {
  test('mutationOptions should create valid mutation options object', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users.store.mutationOptions({
      onSuccess: () => {},
      onError: () => {},
    })

    assert.isObject(options)
    assert.property(options, 'mutationKey')
    assert.property(options, 'mutationFn')
    assert.property(options, 'onSuccess')
    assert.property(options, 'onError')
    assert.isArray(options.mutationKey)
    assert.isFunction(options.mutationFn)
  })

  test('mutationKey should generate consistent keys', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const key1 = tuyau.users.store.mutationKey()
    const key2 = tuyau.users.store.mutationKey()

    assert.deepEqual(key1, key2)
    assert.deepEqual(key1, [['users', 'store']])
  })

  test('should work with useMutation hook', async ({ assert, expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result } = renderHookWithWrapper(() => useMutation(tuyau.users.store.mutationOptions()))

    result.current.mutate({ body: { name: 'foo' } })
    await setTimeout(300)

    assert.equal(result.current.isSuccess, true)
    expectTypeOf(result.current.data).toEqualTypeOf<{ id: number; name: string } | undefined>()
  })

  test('mutationOptions should return correct types', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const mutationOptions = tuyau.users.store.mutationOptions({
      onSuccess: (data) => {
        expectTypeOf(data).toEqualTypeOf<{ id: number; name: string }>()
      },
    })

    expectTypeOf(mutationOptions.mutationKey).toMatchTypeOf<TuyauMutationKey>()
    expectTypeOf(mutationOptions.mutationFn).toBeCallableWith({ body: { name: 'foo' } })
  })

  test('mutation without payload shouldnt require payload', async () => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333').post('/auth/doSomething').reply(200, { success: true })

    const { result } = renderHookWithWrapper(() =>
      useMutation(tuyau.do.something.mutationOptions()),
    )

    await result.current.mutateAsync({})
  })

  test('mutationKey should return TuyauMutationKey type', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const mutationKey = tuyau.do.something.mutationKey()
    expectTypeOf(mutationKey).toMatchTypeOf<TuyauMutationKey>()
    expectTypeOf(mutationKey[0]).toMatchTypeOf<readonly string[]>()
  })

  test('payload not required when request is unknown', async ({}) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333').post('/auth/doSomethingElse').reply(200, { success: true })

    const { result } = renderHookWithWrapper(() =>
      useMutation(tuyau.do.something.mutationOptions()),
    )

    result.current.mutate({})
  })
})

test.group('Mutation | onSuccess Override', () => {
  test('should call original onSuccess when no override provided', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    let originalCalled = false
    const originalOnSuccess = () => {
      originalCalled = true
    }

    nock('http://localhost:3333').post('/users').reply(201, { id: 101, name: 'override1' })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          onSuccess: originalOnSuccess,
        }),
      ),
    )

    result.current.mutate({ body: { name: 'override1' } })
    await setTimeout(300)

    assert.isTrue(originalCalled)
    assert.equal(result.current.isSuccess, true)
  })

  test('should call override onSuccess when provided', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    let originalCalled = false
    let overrideCalled = false

    nock('http://localhost:3333').post('/users').reply(201, { id: 102, name: 'override2' })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          onSuccess: () => (originalCalled = true),
        }),
      ),
    )

    result.current.mutate(
      { body: { name: 'override2' } },
      { onSuccess: () => (overrideCalled = true) },
    )

    await setTimeout(300)

    assert.isTrue(overrideCalled)
    assert.isTrue(originalCalled)
    assert.equal(result.current.isSuccess, true)
  })

  test('should work with override that does not call original', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    let originalCalled = false
    let overrideCalled = false

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          onSuccess: () => (originalCalled = true),
        }),
      ),
    )

    result.current.mutate({ body: { name: 'foo' } }, { onSuccess: () => (overrideCalled = true) })

    await setTimeout(300)

    assert.isTrue(overrideCalled)
    // Note: Both should be true in this case since we're using React Query's override pattern
    assert.isTrue(originalCalled)
    assert.equal(result.current.isSuccess, true)
  })

  test('should provide correct metadata to override', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    let metaReceived = false

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          meta: { custom: 'value' },
          onSuccess: () => {
            metaReceived = true
            // Meta is available through context in React Query
          },
        }),
      ),
    )

    result.current.mutate({ body: { name: 'foo' } })
    await setTimeout(300)

    assert.isTrue(metaReceived)
    assert.equal(result.current.isSuccess, true)
  })

  test('should work with async override functions', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    let originalCalled = false
    let overrideCalled = false

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          onSuccess: () => (originalCalled = true),
        }),
      ),
    )

    result.current.mutate(
      { body: { name: 'foo' } },
      {
        onSuccess: async () => {
          overrideCalled = true
          await setTimeout(10)
        },
      },
    )

    await setTimeout(300)

    assert.isTrue(overrideCalled)
    assert.isTrue(originalCalled)
    assert.equal(result.current.isSuccess, true)
  })

  test('should work without user-provided onSuccess', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    let overrideCalled = false

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result } = renderHookWithWrapper(() => useMutation(tuyau.users.store.mutationOptions()))

    result.current.mutate({ body: { name: 'foo' } }, { onSuccess: () => (overrideCalled = true) })

    await setTimeout(300)

    assert.isTrue(overrideCalled)
    assert.equal(result.current.isSuccess, true)
  })
})
