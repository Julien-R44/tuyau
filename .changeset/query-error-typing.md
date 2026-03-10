---
'@tuyau/react-query': patch
'@tuyau/vue-query': patch
---

Improve end-to-end error type safety for both TanStack Query React and Vue adapters.

`queryOptions()`, `mutationOptions()`, and `infiniteQueryOptions()` now expose typed `TuyauError` instances, so `isStatus()` narrows `error.response` correctly.

```ts
const mutation = useMutation(tuyau.contacts.store.mutationOptions())

if (mutation.error?.isStatus(409)) {
  mutation.error.response.existingId
}
```
