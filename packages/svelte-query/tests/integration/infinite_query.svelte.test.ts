import { describe, it, expect, expectTypeOf, beforeEach, afterEach } from 'vitest'
import { createInfiniteQuery, skipToken } from '@tanstack/svelte-query'
import type { InfiniteData } from '@tanstack/query-core'
import { createTuyau } from '@tuyau/core/client'
import nock from 'nock'

import { defaultRegistry } from '../fixtures/index.ts'
import { createTuyauSvelteQueryClient } from '../../src/index.ts'
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
              getNextPageParam: (lastPage) => lastPage.nextCursor,
            },
          ),
        () => queryClient,
      )

      expectTypeOf(query.data).toEqualTypeOf<
        | InfiniteData<{
            data: Array<{ id: number; title: string }>
            nextCursor: number | null
          }>
        | undefined
      >()
      expect(query.isPending).toBe(true)

      await settle()

      expect(query.isSuccess).toBe(true)
      expect(query.data!.pages).toHaveLength(1)
      expect(query.data!.pages[0].data[0].title).toBe('Article 1')

      const nextPage = nock('http://localhost:3333')
        .get('/articles')
        .query({ page: 2, limit: 10 })
        .reply(200, { data: [{ id: 2, title: 'Article 2' }], nextCursor: null })

      await query.fetchNextPage()
      await settle()

      expect(nextPage.isDone()).toBe(true)
      expect(query.data!.pages.map((page) => page.data[0].title)).toEqual([
        'Article 1',
        'Article 2',
      ])
      expect(query.data!.pageParams).toEqual([1, 2])
      expect(query.hasNextPage).toBe(false)
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
