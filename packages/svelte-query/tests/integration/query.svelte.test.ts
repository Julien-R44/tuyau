import { describe, it, expect, expectTypeOf, beforeEach, afterEach } from 'vitest'
import { createQuery, skipToken } from '@tanstack/svelte-query'
import { createTuyau } from '@tuyau/core/client'
import nock from 'nock'

import { defaultRegistry } from '../fixtures/index.ts'
import { createTuyauSvelteQueryClient } from '../../src/index.ts'
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

      expectTypeOf(query.data).toEqualTypeOf<Array<{ id: number; name: string }> | undefined>()
      expect(query.isPending).toBe(true)

      await settle()

      expect(query.isSuccess).toBe(true)
      expect(query.data).toEqual([{ id: 1, name: 'foo' }])
    }),
  )

  it(
    'select with initial data preserves raw cache data and inferred types',
    withEffectRoot(async () => {
      const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
      const tuyau = createTuyauSvelteQueryClient({ client })
      const initialData = [
        { id: 7, name: 'Alice' },
        { id: 12, name: 'Bob' },
      ]
      const options = tuyau.users.index.queryOptions(
        {},
        {
          initialData: () => initialData,
          enabled: false,
          select: (users) => users.map((user) => user.name),
        },
      )

      const query = createQuery(
        () => options,
        () => queryClient,
      )
      const cached = queryClient.getQueryData(options.queryKey)

      expectTypeOf(query.data).toEqualTypeOf<string[]>()
      expectTypeOf(cached).toEqualTypeOf<Array<{ id: number; name: string }> | undefined>()
      expect(query.data).toEqual(['Alice', 'Bob'])
      expect(cached).toEqual(initialData)
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
