---
'@tuyau/core': patch
---

Fix `TuyauPromise` not being assignable to `Promise<T>`, which broke TanStack Query type inference.

`TuyauPromise` implemented `PromiseLike<T>` but was missing `[Symbol.toStringTag]`, so TypeScript did not consider it structurally compatible with `Promise<T>`. When users passed a tuyau call directly to TanStack Query's `queryFn`, the `data` type was inferred as `TuyauPromise<Response>` instead of `Response`:

```ts
// Before: data was typed as TuyauPromise<User[]> instead of User[]
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: () => tuyau.request('users.index', {}),
})
```

`TuyauPromise` now implements the full `Promise<T>` interface, so it works seamlessly with TanStack Query and any other library expecting `Promise<T>`.
