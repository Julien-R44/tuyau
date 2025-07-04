import nock from 'nock'
import { test } from '@japa/runner'
import { createTuyau } from '@tuyau/client'
import { setTimeout } from 'node:timers/promises'
import { useMutation, useQuery } from '@tanstack/react-query'

import { createTuyauReactQueryClient } from '../src/index.js'
import { ApiDefinition, queryClient, renderHookWithWrapper } from './helpers.jsx'

test.group('Mutation | useQuery', () => {
  test('basic', async ({ expectTypeOf, assert }) => {
    const client = createTuyau<ApiDefinition>({ baseUrl: 'http://localhost:3333' })
    const tuyau = createTuyauReactQueryClient({ client, queryClient })

    nock('http://localhost:3333')
      .post('/users', { name: 'foo' })
      .reply(200, [{ id: 1, name: 'foo' }])

    const { result } = renderHookWithWrapper(async () => {
      const mutation = tuyau.users.$post.mutationOptions({
        onSuccess: () => console.log('success'),
        onError: () => console.log('error'),
      })

      const { mutateAsync, data } = useMutation(mutation)
      expectTypeOf(data).toEqualTypeOf<{ id: number; name: string } | undefined>()
      expectTypeOf(mutateAsync).parameter(0).toEqualTypeOf<{ name: string }>()

      await mutateAsync({ name: 'foo' })

      return { data }
    })

    await setTimeout(300)

    console.log('result', result.current.data)
  })
})
