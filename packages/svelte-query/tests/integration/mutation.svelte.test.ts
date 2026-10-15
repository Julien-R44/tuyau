import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createMutation } from '@tanstack/svelte-query'
import { createTuyau } from '@tuyau/core/client'
import nock from 'nock'

import { defaultRegistry } from '../fixtures/index.ts'
import { createTuyauSvelteQueryClient } from '../../src/main.ts'
import { withEffectRoot, createTestQueryClient, settle } from './utils.svelte.ts'

describe('Mutation | createMutation', () => {
  let queryClient = createTestQueryClient()

  beforeEach(() => {
    queryClient = createTestQueryClient()
  })

  afterEach(() => {
    queryClient.clear()
    nock.cleanAll()
  })

  it(
    'basic e2e mutation',
    withEffectRoot(async () => {
      const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
      const tuyau = createTuyauSvelteQueryClient({ client })

      nock('http://localhost:3333').post('/users').reply(201, { id: 1, name: 'foo' })

      const mutation = createMutation(
        () => tuyau.users.store.mutationOptions(),
        () => queryClient,
      )

      mutation.mutate({ body: { name: 'foo' } })

      await settle()

      expect(mutation.isSuccess).toBe(true)
    }),
  )

  it(
    'onSuccess callback fires',
    withEffectRoot(async () => {
      const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
      const tuyau = createTuyauSvelteQueryClient({ client })

      let onSuccessCalled = false

      nock('http://localhost:3333').post('/users').reply(201, { id: 101, name: 'bar' })

      const mutation = createMutation(
        () =>
          tuyau.users.store.mutationOptions({
            onSuccess: () => {
              onSuccessCalled = true
            },
          }),
        () => queryClient,
      )

      mutation.mutate({ body: { name: 'bar' } })

      await settle()

      expect(mutation.isSuccess).toBe(true)
      expect(onSuccessCalled).toBe(true)
    }),
  )
})
