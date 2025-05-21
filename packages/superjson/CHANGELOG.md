# @tuyau/superjson

## 0.1.0

### Minor Changes

- d951475: BREAKING: From now on, requests sent via Tuyau will also be serialized with SuperJSON. This was not the case before (even though it should have been). To ensure safety, we consider this a breaking change.

  If you want to keep the previous behavior, you can disable this by setting the `stringifyRequest: false` property in the `superjson` plugin.

  ## Middleware Position Change

  Also, you must now add the `@tuyau/superjson/superjson_middleware` as a `router` middleware instead of a `server` middleware, and make sure to place it last.

## 0.0.2

### Patch Changes

- Updated dependencies [dc0e6bf]
  - @tuyau/utils@0.0.7
