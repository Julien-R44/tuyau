import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createInfiniteQuery, skipToken } from '@tanstack/svelte-query'
import { createTuyau } from '@tuyau/core/client'
import nock from 'nock'

import { defaultRegistry } from '../fixtures/index.ts'
import { createTuyauSvelteQueryClient } from '../../src/main.ts'
import { withEffectRoot, createTestQueryClient, settle } from './utils.svelte.ts'

describe('Infinite Query | createInfiniteQuery', () => {
  let queryClient = createTestQueryClient()

  beforeEach(() => {
    queryClient = createTestQueryClient()
  })

  afterEach(() => {
    queryClient.clear()
    nock.cleanAll()
  })

  it(
    'basic e2e pagination',
    withEffectRoot(async () => {
      const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
      const tuyau = createTuyauSvelteQueryClient({ client })

      nock('http://localhost:3333')
        .get('/articles')
        .query({ page: 1, limit: 10 })
        .reply(200, { data: [{ id: 1, title: 'Article 1' }], nextCursor: 2 })

      const query = createInfiniteQuery(
        () =>
          tuyau.articles.index.infiniteQueryOptions(
            { query: { page: 1, limit: 10 } },
            {
              pageParamKey: 'page',
              initialPageParam: 1,
              getNextPageParam: (lastPage: any) => lastPage.nextCursor,
            },
          ),
        () => queryClient,
      )

      expect(query.isPending).toBe(true)

      await settle()

      expect(query.isSuccess).toBe(true)
      expect(query.data!.pages).toHaveLength(1)
      expect(query.data!.pages[0].data[0].title).toBe('Article 1')
    }),
  )

  it(
    'skipToken prevents fetching',
    withEffectRoot(async () => {
      const client = createTuyau({ baseUrl: 'http://localhost:3333', registry: defaultRegistry })
      const tuyau = createTuyauSvelteQueryClient({ client })

      const query = createInfiniteQuery(
        () =>
          tuyau.articles.index.infiniteQueryOptions(skipToken, {
            pageParamKey: 'page',
            initialPageParam: 1,
            getNextPageParam: () => null,
          }),
        () => queryClient,
      )

      expect(query.isFetching).toBe(false)
      expect(query.data).toBeUndefined()
    }),
  )
})
