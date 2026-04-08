import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/core/client'

import { defaultRegistry } from './fixtures/index.ts'
import { TuyauMutationKey } from '../src/types/common.ts'
import { createTuyauSvelteQueryClient } from '../src/index.ts'
import { withRequestCapture } from '@tuyau/query-core/test-helpers'

test.group('Mutation | Options', () => {
  test('mutationOptions should create valid mutation options object', ({ assert }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauSvelteQueryClient({ client })

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
    const tuyau = createTuyauSvelteQueryClient({ client })

    const key1 = tuyau.users.store.mutationKey()
    const key2 = tuyau.users.store.mutationKey()

    assert.deepEqual(key1, key2)
    assert.deepEqual(key1, [['users', 'store']])
  })

  test('mutationKey should return TuyauMutationKey type', ({ expectTypeOf }) => {
    const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
    const tuyau = createTuyauSvelteQueryClient({ client })

    const mutationKey = tuyau.do.something.mutationKey()
    expectTypeOf(mutationKey).toMatchTypeOf<TuyauMutationKey>()
    expectTypeOf(mutationKey[0]).toMatchTypeOf<readonly string[]>()
  })
})

test.group('Mutation | Ky retry disabled', () => {
  test('should pass retry: 0 to disable Ky retries', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauSvelteQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'retry-test' })

    const options: any = tuyau.users.store.mutationOptions()

    await options.mutationFn({ body: { name: 'retry-test' } })

    assert.equal(capture.getLastRequest()?.options.retry, 0)
  })
})

test.group('Mutation | Ky options', () => {
  test('should pass timeout option to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauSvelteQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'timeout-test' })

    const options: any = tuyau.users.store.mutationOptions({
      tuyau: { timeout: 60_000 },
    })

    await options.mutationFn({ body: { name: 'timeout-test' } })

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 60_000)
    assert.equal(lastRequest?.options.retry, 0)
  })

  test('abortOnUnmount should not be passed to client.request', async ({ assert }) => {
    const { client, capture } = withRequestCapture(
      createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry }),
    )
    const tuyau = createTuyauSvelteQueryClient({ client })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'abort-test' })

    const options: any = tuyau.users.store.mutationOptions({
      tuyau: { abortOnUnmount: true, timeout: 5000 },
    })

    await options.mutationFn({ body: { name: 'abort-test' } })

    const lastRequest = capture.getLastRequest()
    assert.equal(lastRequest?.options.timeout, 5000)
    assert.notProperty(lastRequest?.options, 'abortOnUnmount')
  })
})
