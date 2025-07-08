---
'@tuyau/react-query': patch
'@tuyau/inertia': patch
'@tuyau/client': patch
---

- Added `abortOnUnmount` option to `createTuyauReactQueryClient` to control request cancellation when a component unmounts.
- Updated implementation of `infiniteQueryOptions` to include a `pagePageParamKey` option
