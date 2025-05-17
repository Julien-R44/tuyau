import nock from 'nock'
import { createTuyau } from '@tuyau/client'
import React, { PropsWithChildren } from 'react'
import { setTimeout } from 'node:timers/promises'
import { getActiveTest, test } from '@japa/runner'
import { renderHook } from '@testing-library/react'
import { Serialize, Simplify } from '@tuyau/utils/types'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

import { createTuyauReactQueryClient } from '../index.js'

type ApiDefinition = {
  routes: []
  definition: {
    auth: {
      login: {
        $post: {
          request: { email: string; password: string }
          response: {
            200: Simplify<Serialize<{ token: string }>>
          }
        }
      }
    }
    users: {
      '$get': {
        request: { name: string | null }
        response: {
          200: Simplify<Serialize<{ id: number; name: string }[]>>
        }
      }
      '$post': {
        request: { name: string }
        response: { 201: Simplify<Serialize<{ id: number; name: string }>> }
      }
      ':id': {
        $get: {
          request: {}
          response: { 200: Simplify<Serialize<{ id: number; name: string }>> }
        }
      }
    }
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

function renderHookWithWrapper<T>(callback: () => T) {
  const result = renderHook(callback, { wrapper })

  const test = getActiveTest()
  if (!test) throw new Error('No active test found')

  test.cleanup(() => result.unmount())

  return result
}

test.group('React Query | useQuery', () => {
  test('basic', async ({ expectTypeOf, assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .get('/users')
      .query({ name: 'foo' })
      .reply(200, [{ id: 1, name: 'foo' }])

    const { result } = renderHookWithWrapper(() =>
      useQuery(tuyau.users.$get.queryOptions({ name: 'foo' })),
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
      .reply(200, [{ id: 1, name: 'foo' }])

    const { result } = renderHookWithWrapper(() => {
      const options = tuyau.users.$get.queryOptions(
        { name: 'foo' },
        { initialData: () => [{ id: 1, name: 'foo' }] },
      )

      return useQuery(options)
    })

    const data = result.current.data
    expectTypeOf(data).toEqualTypeOf<Array<{ id: number; name: string }>>()
  })
})

test.group('React Query | queryOptions', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users.$get.queryOptions(
      { name: 'foo' },
      { initialData: () => [{ id: 1, name: 'foo' }], staleTime: 1000 },
    )

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.staleTime, 1000)
    assert.deepEqual(result.queryKey, [
      ['users', '$get'],
      { input: { name: 'foo' }, type: 'query' },
    ])
  })

  test('with route param call', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const result = tuyau.users({ id: 1 }).$get.queryOptions({})

    assert.isFunction(result.queryFn)
    assert.deepEqual(result.queryKey, [['users', '1', '$get'], { input: {}, type: 'query' }])
  })
})

test.group('React query | queryKey', () => {
  test('basic', ({ assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    const r1 = tuyau.users.$get.queryKey({ name: 'foo' })
    const r2 = tuyau.users.$get.queryKey()

    assert.deepEqual(r1, [['users', '$get'], { input: { name: 'foo' }, type: 'query' }])
    assert.deepEqual(r2, [['users', '$get'], { type: 'query' }])
  })
})
