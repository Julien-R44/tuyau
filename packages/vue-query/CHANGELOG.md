# @tuyau/vue-query

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
  import { createTuyau } from "@tuyau/core/client";
  import { createTuyauVueQueryClient } from "@tuyau/vue-query";

  const client = createTuyau<api>({ baseUrl: "http://localhost:3333" });
  const tuyau = createTuyauVueQueryClient({ client });

  // Queries
  useQuery(tuyau.users.index.queryOptions({ query: { name: "John" } }));

  // Reactive queries (use a getter for automatic re-evaluation)
  const name = ref("John");
  useQuery(() =>
    tuyau.users.index.queryOptions({ query: { name: name.value } }),
  );

  // Mutations
  const { mutate } = useMutation(tuyau.users.store.mutationOptions());

  // Infinite queries
  useInfiniteQuery(
    tuyau.articles.index.infiniteQueryOptions(
      { query: { limit: 10 } },
      {
        pageParamKey: "page",
        initialPageParam: 1,
        getNextPageParam: (p) => p.nextCursor,
      },
    ),
  );

  // Conditional queries with skipToken
  useQuery(
    tuyau.users.show.queryOptions(
      userId ? { params: { id: userId } } : skipToken,
    ),
  );

  // Query invalidation
  queryClient.invalidateQueries(tuyau.users.pathFilter());
  ```

  Same API as `@tuyau/react-query` — see its documentation for the full reference.

### Patch Changes

- Updated dependencies [665cd5e]
  - @tuyau/query-core@1.1.0
