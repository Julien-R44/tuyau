---
'@tuyau/core': major
'@tuyau/query-core': major
'@tuyau/react-query': major
'@tuyau/svelte-query': major
'@tuyau/vue-query': major
---

Migrate the HTTP client to Ky 2.

- Ky hooks now receive a single state object, for example `beforeRequest: [({ request }) => { /* ... */ }]`.
- HTTP errors use Ky's pre-parsed `data` as `error.response`. An empty, malformed, or unreadable body leaves `response` undefined without losing the HTTP status. Non-JSON error bodies are text, including binary content types.
- `isStatus()` and `isValidationError()` narrow the payload type but no longer guarantee its presence. Check `error.isStatus(422) && error.hasResponse()` before accessing a typed payload. `hasResponse()` checks presence only, not schema validity, and preserves null and other falsy payloads.
- Errors now distinguish `http`, `network`, `timeout`, `aborted`, and `unknown`. Parsing failures and exceptions thrown by hooks are no longer reported as network failures. The original failure remains available through `cause`.
- Tuyau's `baseUrl` still appends route paths, preserving prefixes such as `/api`. Ky's `prefix` and native `baseUrl` are not exposed as per-request options.
- TanStack Query integrations require Tuyau core 2 and expose the same optional error payloads.

See [the migration guide](https://github.com/Julien-R44/tuyau/blob/main/docs/migration-v2.md) for before-and-after examples.
