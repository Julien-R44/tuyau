import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import { setTimeout } from 'node:timers/promises'
import { useMutation } from '@tanstack/react-query'

import { TuyauMutationKey } from '../src/types.js'
import { createTuyauReactQueryClient } from '../src/index.js'
import { ApiDefinition, queryClient, renderHookWithWrapper } from './helpers.jsx'

test.group('Mutation | Options', () => {
  test('mutationOptions should create valid mutation options object', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const options = tuyau.users.$post.mutationOptions({
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
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const key1 = tuyau.users.$post.mutationKey()
    const key2 = tuyau.users.$post.mutationKey()

    assert.deepEqual(key1, key2)
    assert.deepEqual(key1, [['users', '$post']])
  })

  test('should work with useMutation hook', async ({ assert, expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

    const { result } = renderHookWithWrapper(() => useMutation(tuyau.users.$post.mutationOptions()))

    result.current.mutate({ name: 'foo' })
    await setTimeout(300)

    assert.equal(result.current.isSuccess, true)
    expectTypeOf(result.current.data).toEqualTypeOf<{ id: number; name: string } | undefined>()
  })
})

test.group('Types | Mutation Types', () => {
  test('mutationOptions should return correct types', ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const mutationOptions = tuyau.users.$post.mutationOptions({
      onSuccess: (data) => {
        expectTypeOf(data).toEqualTypeOf<{ id: number; name: string }>()
      },
    })

    expectTypeOf(mutationOptions.mutationKey).toMatchTypeOf<TuyauMutationKey>()
    expectTypeOf(mutationOptions.mutationFn).toBeCallableWith({ name: 'foo' })
  })

  test('mutationKey should return TuyauMutationKey type', ({ expectTypeOf }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const mutationKey = tuyau.users.$post.mutationKey()
    expectTypeOf(mutationKey).toMatchTypeOf<TuyauMutationKey>()
    expectTypeOf(mutationKey[0]).toMatchTypeOf<readonly string[]>()
  })
})
