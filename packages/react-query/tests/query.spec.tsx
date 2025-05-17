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
      $get: {
        request: { name: string | null }
        response: {
          200: Simplify<Serialize<{ id: number; name: string }[]>>
        }
      }
      $post: {
        request: { name: string }
        response: { 201: Simplify<Serialize<{ id: number; name: string }>> }
      }
    }
  }
}

const queryClient = new QueryClient()
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

test.group('React Query', (group) => {
  test('basic', async ({ expectTypeOf }) => {
    const tuyauClient = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client: tuyauClient, queryClient })

    nock('http://localhost:3333')
      .get('/users')
      // .query({ name: 'foo' })
      .reply(200, [{ id: 1, name: 'foo' }])

    const { result } = renderHookWithWrapper(() =>
      useQuery(tuyau.users.$get.queryOptions({ name: 'foo' })),
    )

    await setTimeout(1000)

    expectTypeOf(result.current.data).toEqualTypeOf<
      Array<{ id: number; name: string }> | undefined
    >()
  })

  test('with initial data', ({ expectTypeOf }) => {
    const tuyauClient = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const queryClient = new QueryClient()
    const tuyau = createTuyauReactQueryClient({ client: tuyauClient, queryClient })

    nock('http://localhost:3333')
      .get('/users')
      // .query({ name: 'foo' })
      .reply(200, [{ id: 1, name: 'foo' }])

    const { result } = renderHookWithWrapper(() =>
      useQuery(
        tuyau.users.$get.queryOptions(
          { name: 'foo' },
          { initialData: () => [{ id: 1, name: 'foo' }] },
        ),
      ),
    )

    const data = result.current.data
    expectTypeOf(data).toEqualTypeOf<Array<{ id: number; name: string }>>()
  })
})
