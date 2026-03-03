---
'@tuyau/core': minor
---

Add typed non-throwing error handling with `.safe()` and `TuyauError`

- Add `TuyauPromise`, a thenable wrapper returned by client requests that preserves `await`, `.catch()`, and `.finally()` while adding `.safe()`
- Add `.safe()` to return `[data, null]` on success or `[null, error]` on failure without throwing
- Add `TuyauError` as the shared base class for client errors, with:
  - `kind` to distinguish `'http'` and `'network'` failures
  - `status`, `response`, `rawResponse`, and `rawRequest`
  - `isStatus()` to narrow typed HTTP error payloads without `instanceof` checks
- Make `TuyauHTTPError` and `TuyauNetworkError` extend `TuyauError`
- Extract non-2xx response payloads into generated route metadata so client errors can be typed from controller return unions
- Add `ExtractErrorResponse` and `ErrorResponseOf` type utilities
- Update `Route.Error`, `Path.Error`, `RouteWithRegistry.Error`, and `PathWithRegistry.Error` to expose the unified `TuyauError` contract
- Keep thrown errors specific in `try/catch`: HTTP failures still throw `TuyauHTTPError`, and transport failures still throw `TuyauNetworkError`

This also adds coverage and playground examples for:

- `.safe()` on fluent, path-based, and named requests
- `isStatus()` narrowing against typed error responses
- typed route helpers for error handling
