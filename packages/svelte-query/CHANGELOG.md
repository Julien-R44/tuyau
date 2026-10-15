# @tuyau/svelte-query

## 1.2.0

### Minor Changes

- 1856e02: Add `@tuyau/svelte-query` for Svelte 5 and TanStack Svelte Query. Use `createTuyauSvelteQueryClient` to create typed query, infinite query, and mutation options from a Tuyau client.

### Patch Changes

- 60c5bd0: Apply global HTTP options, including `timeout`, to queries, infinite queries, and mutations. Local `tuyau` options override global options. Ky retries remain disabled so TanStack Query controls retries.
- Updated dependencies [60c5bd0]
  - @tuyau/query-core@1.1.1
