---
'@tuyau/react-query': patch
---

- Added `abortOnUnmount` option to `createTuyauReactQueryClient` to control request cancellation when a component unmounts.
- Updated implementation of `infiniteQueryOptions` to include a `pagePageParamKey` option
