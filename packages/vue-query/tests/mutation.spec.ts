import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'
import { setTimeout } from 'node:timers/promises'
import { useMutation } from '@tanstack/vue-query'
import { toValue } from 'vue'

import { defaultRegistry } from './fixtures/index.ts'
import { TuyauMutationKey } from '../src/types/common.ts'
import { createTuyauVueQueryClient } from '../src/index.ts'
import { withRequestCapture } from '@tuyau/query-core/test-helpers'
import { queryClient, renderComposable, flushPromises } from './helpers/index.ts'

test.group('Mutation | Options', (group) => {
  group.each.setup(() => queryClient.clear())

  test('mutationOptions should create valid mutation options object', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

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
    const tuyau = createTuyauVueQueryClient({ client })

    const key1 = tuyau.users.store.mutationKey()
    const key2 = tuyau.users.store.mutationKey()

    assert.deepEqual(key1, key2)
    assert.deepEqual(key1, [['users', 'store']])
  })

  test('should work with useMutation composable', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result, wrapper } = renderComposable(() =>
      useMutation(tuyau.users.store.mutationOptions()),
    )

    result.mutate({ body: { name: 'foo' } })
    await flushPromises()
    await setTimeout(300)

    assert.equal(toValue(result.isSuccess), true)
    wrapper.unmount()
  })

  test('mutationKey should return TuyauMutationKey type', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

    const mutationKey = tuyau.do.something.mutationKey()
    expectTypeOf(mutationKey).toMatchTypeOf<TuyauMutationKey>()
    expectTypeOf(mutationKey[0]).toMatchTypeOf<readonly string[]>()
  })
})

test.group('Mutation | onSuccess Override', (group) => {
  group.each.setup(() => queryClient.clear())

  test('should call original onSuccess when no override provided', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

    let originalCalled = false

    nock('http://localhost:3333').post('/users').reply(201, { id: 101, name: 'override1' })

    const { result, wrapper } = renderComposable(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          onSuccess: () => {
            originalCalled = true
          },
        }),
      ),
    )

    result.mutate({ body: { name: 'override1' } })
    await flushPromises()
    await setTimeout(300)

    assert.isTrue(originalCalled)
    assert.equal(toValue(result.isSuccess), true)
    wrapper.unmount()
  })

  test('should work without user-provided onSuccess', async ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauVueQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result, wrapper } = renderComposable(() =>
      useMutation(tuyau.users.store.mutationOptions()),
    )

    result.mutate({ body: { name: 'foo' } })
    await flushPromises()
    await setTimeout(300)

    assert.equal(toValue(result.isSuccess), true)
    wrapper.unmount()
  })
})

test.group('Mutation | Ky retry disabled', (group) => {
  group.each.setup(() => queryClient.clear())

  test('should pass retry: 0 to disable Ky retries', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauVueQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'retry-test' })

    const { result, wrapper } = renderComposable(() =>
      useMutation(tuyau.users.store.mutationOptions()),
    )

    result.mutate({ body: { name: 'retry-test' } })
    await flushPromises()
    await setTimeout(300)

    assert.equal(capture.getLastRequest()?.options.retry, 0)
    wrapper.unmount()
  })
})

test.group('Mutation | Ky options', (group) => {
  group.each.setup(() => queryClient.clear())

  test('should pass timeout option to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauVueQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'timeout-test' })

    const { result, wrapper } = renderComposable(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          tuyau: { timeout: 60_000 },
        }),
      ),
    )

    result.mutate({ body: { name: 'timeout-test' } })
    await flushPromises()
    await setTimeout(300)

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

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'abort-test' })

    const { result, wrapper } = renderComposable(() =>
      useMutation(
        tuyau.users.store.mutationOptions({
          tuyau: { abortOnUnmount: true, timeout: 5000 },
        }),
      ),
    )

    result.mutate({ body: { name: 'abort-test' } })
    await flushPromises()
    await setTimeout(300)

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 5000)
    assert.notProperty(lastRequest?.options, 'abortOnUnmount')
    wrapper.unmount()
  })
})
