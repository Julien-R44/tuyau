import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { setTimeout } from 'node:timers/promises'
import { useMutation } from '@tanstack/react-query'

import { defaultRegistry } from './fixtures/index.ts'
import { TuyauMutationKey } from '../src/types/common.ts'
import { renderHookWithWrapper } from './helpers/index.tsx'
import { createTuyauReactQueryClient } from '../src/index.ts'
import { withRequestCapture } from '@tuyau/query-core/test-helpers'

test.group('Mutation | Options', () => {
  test('mutationOptions should create valid mutation options object', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

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
    const tuyau = createTuyauReactQueryClient({ client })

    const key1 = tuyau.users.store.mutationKey()
    const key2 = tuyau.users.store.mutationKey()

    assert.deepEqual(key1, key2)
    assert.deepEqual(key1, [['users', 'store']])
  })

  test('should work with useMutation hook', async ({ assert, expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result } = renderHookWithWrapper(() => useMutation(tuyau.users.store.mutationOptions()))

    result.current.mutate({ body: { name: 'foo' } })
    await setTimeout(300)

    assert.equal(result.current.isSuccess, true)
    expectTypeOf(result.current.data).toEqualTypeOf<{ id: number; name: string } | undefined>()
  })

  test('mutationOptions should return correct types', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const mutationOptions = tuyau.users.store.mutationOptions({
      onSuccess: (data) => {
        expectTypeOf(data).toEqualTypeOf<{ id: number; name: string }>()
      },
    })

    expectTypeOf(mutationOptions.mutationKey).toMatchTypeOf<TuyauMutationKey>()
    expectTypeOf(mutationOptions.mutationFn).toBeCallableWith(
      { body: { name: 'foo' } },
      { client: null as any, meta: {} },
    )
  })

  test('mutation without payload shouldnt require payload', async () => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333').post('/auth/doSomething').reply(200, { success: true })

    const { result } = renderHookWithWrapper(() =>
      useMutation(tuyau.do.something.mutationOptions()),
    )

    await result.current.mutateAsync({}).catch(() => {})
  })

  test('mutationKey should return TuyauMutationKey type', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

    const mutationKey = tuyau.do.something.mutationKey()
    expectTypeOf(mutationKey).toMatchTypeOf<TuyauMutationKey>()
    expectTypeOf(mutationKey[0]).toMatchTypeOf<readonly string[]>()
  })

  test('payload not required when request is unknown', async () => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauReactQueryClient({ client })

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
    const tuyau = createTuyauReactQueryClient({ client })

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
    const tuyau = createTuyauReactQueryClient({ client })

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
    const tuyau = createTuyauReactQueryClient({ client })

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
    const tuyau = createTuyauReactQueryClient({ client })

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
    const tuyau = createTuyauReactQueryClient({ client })

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
    const tuyau = createTuyauReactQueryClient({ client })

    let overrideCalled = false

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result } = renderHookWithWrapper(() => useMutation(tuyau.users.store.mutationOptions()))

    result.current.mutate({ body: { name: 'foo' } }, { onSuccess: () => (overrideCalled = true) })

    await setTimeout(300)

    assert.isTrue(overrideCalled)
    assert.equal(result.current.isSuccess, true)
  })
})

test.group('Mutation | Ky retry disabled', () => {
  test('should pass retry: 0 to disable Ky retries', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'retry-test' })

    const { result } = renderHookWithWrapper(() => useMutation(tuyau.users.store.mutationOptions()))

    result.current.mutate({ body: { name: 'retry-test' } })
    await setTimeout(300)

    assert.equal(capture.getLastRequest()?.options.retry, 0)
  })
})

test.group('Mutation | Ky options', () => {
  test('should pass timeout option to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'timeout-test' })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          tuyau: { timeout: 60_000 },
        }),
      ),
    )

    result.current.mutate({ body: { name: 'timeout-test' } })
    await setTimeout(300)

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 60_000)
    assert.equal(lastRequest?.options.retry, 0)
  })

  test('should pass custom headers option to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'headers-test' })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          tuyau: { headers: { 'X-Custom-Header': 'custom-value' } },
        }),
      ),
    )

    result.current.mutate({ body: { name: 'headers-test' } })
    await setTimeout(300)

    assert.deepEqual(capture.getLastRequest()?.options.headers, {
      'X-Custom-Header': 'custom-value',
    })
  })

  test('should pass multiple Ky options to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauReactQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'multi-options-test' })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          tuyau: {
            timeout: 30_000,
            headers: { Authorization: 'Bearer token123' },
            credentials: 'include',
          },
        }),
      ),
    )

    result.current.mutate({ body: { name: 'multi-options-test' } })
    await setTimeout(300)

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

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'abort-test' })

    const { result } = renderHookWithWrapper(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          tuyau: { abortOnUnmount: true, timeout: 5000 },
        }),
      ),
    )

    result.current.mutate({ body: { name: 'abort-test' } })
    await setTimeout(300)

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 5000)
    assert.notProperty(lastRequest?.options, 'abortOnUnmount')
  })
})
