---
'@tuyau/query-core': minor
'@tuyau/react-query': minor
'@tuyau/vue-query': minor
---

Extract shared utilities into `@tuyau/query-core` and add `@tuyau/vue-query` adapter for TanStack Vue Query.

- `@tuyau/query-core`: New package with framework-agnostic utilities (`buildKey`, `extractKyOptions`, `invoke`, shared types) extracted from `@tuyau/react-query`.
- `@tuyau/react-query`: Refactored to use `@tuyau/query-core` internally. No breaking changes — all existing exports are preserved.
- `@tuyau/vue-query`: New package providing a Vue adapter for TanStack Query, mirroring the `@tuyau/react-query` API with Vue-specific type adaptations.
