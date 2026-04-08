import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createQuery, skipToken } from '@tanstack/svelte-query'
import { createTuyau } from '@tuyau/core/client'
import nock from 'nock'

import { defaultRegistry } from '../fixtures/index.ts'
import { createTuyauSvelteQueryClient } from '../../src/main.ts'
import { withEffectRoot, createTestQueryClient, settle } from './utils.svelte.ts'

describe('Query | createQuery', () => {
  let queryClient = createTestQueryClient()

  beforeEach(() => {
    queryClient = createTestQueryClient()
  })

  afterEach(() => {
    queryClient.clear()
    nock.cleanAll()
  })

  it(
    'basic e2e fetch',
    withEffectRoot(async () => {
      const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
      const tuyau = createTuyauSvelteQueryClient({ client })

      nock('http://localhost:3333')
        .get('/users')
        .query({ email: 'fo@ok.com' })
        .reply(200, [{ id: 1, name: 'foo' }])

      const query = createQuery(
        () => tuyau.users.index.queryOptions({ query: { email: 'fo@ok.com' } }),
        () => queryClient,
      )

      expect(query.isPending).toBe(true)

      await settle()

      expect(query.isSuccess).toBe(true)
      expect(query.data).toEqual([{ id: 1, name: 'foo' }])
    }),
  )

  it(
    'with initial data',
    withEffectRoot(async () => {
      const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
      const tuyau = createTuyauSvelteQueryClient({ client })

      const query = createQuery(
        () =>
          tuyau.users.index.queryOptions({}, { initialData: () => [{ id: 1, name: 'initial' }] }),
        () => queryClient,
      )

      expect(query.data).toEqual([{ id: 1, name: 'initial' }])
    }),
  )

  it(
    'skipToken prevents fetching',
    withEffectRoot(async () => {
      const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
      const tuyau = createTuyauSvelteQueryClient({ client })

      const query = createQuery(
        () => tuyau.users.index.queryOptions(skipToken),
        () => queryClient,
      )

      expect(query.isFetching).toBe(false)
      expect(query.data).toBeUndefined()
    }),
  )
})
