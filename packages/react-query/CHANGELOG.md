# @tuyau/react-query

## 1.1.1

### Patch Changes

- 60c5bd0: Apply global HTTP options, including `timeout`, to queries, infinite queries, and mutations. Local `tuyau` options override global options. Ky retries remain disabled so TanStack Query controls retries.
- Updated dependencies [60c5bd0]
  - @tuyau/query-core@1.1.1

## 1.1.0

### Minor Changes

- 665cd5e: Extract shared utilities into `@tuyau/query-core` and add `@tuyau/vue-query` adapter for TanStack Vue Query.
  - `@tuyau/query-core`: New package with framework-agnostic utilities (`buildKey`, `extractKyOptions`, `invoke`, shared types) extracted from `@tuyau/react-query`.
  - `@tuyau/react-query`: Refactored to use `@tuyau/query-core` internally. No breaking changes — all existing exports are preserved.
  - `@tuyau/vue-query`: New package providing a Vue adapter for TanStack Query, mirroring the `@tuyau/react-query` API with Vue-specific type adaptations.

  ## `@tuyau/vue-query`

  ```bash
  pnpm add @tuyau/vue-query @tuyau/core @tanstack/vue-query
  ```

  ```ts
  import { createTuyau } from '@tuyau/core/client'
  import { createTuyauVueQueryClient } from '@tuyau/vue-query'

  const client = createTuyau<api>({ baseUrl: 'http://localhost:3333' })
  const tuyau = createTuyauVueQueryClient({ client })

  // Queries
  useQuery(tuyau.users.index.queryOptions({ query: { name: 'John' } }))

  // Reactive queries (use a getter for automatic re-evaluation)
  const name = ref('John')
  useQuery(() => tuyau.users.index.queryOptions({ query: { name: name.value } }))

  // Mutations
  const { mutate } = useMutation(tuyau.users.store.mutationOptions())

  // Infinite queries
  useInfiniteQuery(
    tuyau.articles.index.infiniteQueryOptions(
      { query: { limit: 10 } },
      {
        pageParamKey: 'page',
        initialPageParam: 1,
        getNextPageParam: (p) => p.nextCursor,
      },
    ),
  )

  // Conditional queries with skipToken
  useQuery(tuyau.users.show.queryOptions(userId ? { params: { id: userId } } : skipToken))

  // Query invalidation
  queryClient.invalidateQueries(tuyau.users.pathFilter())
  ```

  Same API as `@tuyau/react-query` — see its documentation for the full reference.

### Patch Changes

- 68dec02: Improve end-to-end error type safety for both TanStack Query React and Vue adapters.

  `queryOptions()`, `mutationOptions()`, and `infiniteQueryOptions()` now expose typed `TuyauError` instances, so `isStatus()` narrows `error.response` correctly.

  ```ts
  const mutation = useMutation(tuyau.contacts.store.mutationOptions())

  if (mutation.error?.isStatus(409)) {
    mutation.error.response.existingId
  }
  ```

- Updated dependencies [665cd5e]
  - @tuyau/query-core@1.1.0

## 1.0.0

### Major Changes

- Complete rewrite of Tuyau. Documentation will be available soon on the AdonisJS website.

## 0.0.1-next.1

### Patch Changes

- dd5cc13: - Added `abortOnUnmount` option to `createTuyauReactQueryClient` to control request cancellation when a component unmounts.
  - Updated implementation of `infiniteQueryOptions` to include a `pagePageParamKey` option

## 0.0.1-next.0

### Patch Changes

- 62edf66: Added React Query integration. See docs for more information.
- Updated dependencies [62edf66]
  - @tuyau/client@0.2.11-next.0
