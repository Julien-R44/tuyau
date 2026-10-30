# Migrate to Tuyau 2

Tuyau 2 uses Ky 2. Update `@tuyau/core` and any installed Tuyau TanStack Query integrations together. This guide covers changes to Tuyau's client API. For custom Ky options, also check the [Ky 2 release notes](https://github.com/sindresorhus/ky/releases/tag/v2.0.0).

## Update hooks

Ky hooks now receive one state object instead of positional arguments.

Before:

```ts
createTuyau({
  baseUrl,
  registry,
  hooks: {
    beforeRequest: [(request) => request.headers.set('Authorization', token)],
    afterResponse: [(_request, _options, response) => console.log(response.status)],
    beforeError: [(error) => error],
  },
})
```

After:

```ts
createTuyau({
  baseUrl,
  registry,
  hooks: {
    beforeRequest: [({ request }) => request.headers.set('Authorization', token)],
    afterResponse: [({ response }) => console.log(response.status)],
    beforeError: [({ error }) => error],
  },
})
```

`beforeError` now receives non-HTTP errors too. Narrow with Ky's `isHTTPError(error)` before reading `error.response` or `error.data`. Its options are normalized fetch options; do not read the old `options.prefixUrl` field.

## Check error payload presence

An HTTP error still has its status and raw response when its body is empty or cannot be parsed. Its parsed `response` can now be `undefined`, even after `isStatus()` or `isValidationError()`.

Before:

```ts
if (error.isStatus(422)) {
  showValidationErrors(error.response.messages)
}
```

After:

```ts
if (error.isStatus(422)) {
  // error.response: ValidationPayload | undefined
  if (error.hasResponse()) {
    showValidationErrors(error.response.messages)
  } else {
    showError('Validation failed without a readable payload')
  }
}
```

You can also write `error.isStatus(422) && error.hasResponse()`, or call the guards in the opposite order. This applies to `.safe()`, `Route.Error`, `Path.Error`, and React, Svelte, and Vue Query errors.

`hasResponse()` means `response !== undefined`. It returns true for `null`, `false`, `0`, and `''`. It does **not** validate the response schema: the inferred payload type still comes from the route registry.

For unknown status codes, the payload type is `unknown`.

## Handle error categories

`.safe()` still returns `[data, null]` or `[null, error]`. Errors now distinguish transport failures from application and parsing failures:

```ts
const [data, error] = await client.api.contacts.show({ params: { id: 1 } }).safe()

if (error) {
  switch (error.kind) {
    case 'http':
      console.log('HTTP status:', error.status)
      break
    case 'network':
      showError('Could not reach the server')
      break
    case 'timeout':
      showError('The request timed out')
      break
    case 'aborted':
      // Cancelled by the caller; usually no notification is needed.
      break
    case 'unknown':
      console.error('Parsing, hook, or other failure:', error.cause)
      break
  }
}
```

The exported classes are `TuyauHTTPError`, `TuyauNetworkError`, `TuyauTimeoutError`, `TuyauAbortedError`, and `TuyauUnknownError`. All extend `TuyauError` and preserve the original failure as `cause`, including a custom abort reason.

## Use parsed HTTP error data

Tuyau now reads Ky's `HTTPError.data` rather than parsing the HTTP response again. JSON error bodies use the configured `parseJson` function, including the SuperJSON plugin. Non-JSON bodies are text, including `application/octet-stream` bodies that Tuyau previously returned as `ArrayBuffer`.

Inside a Ky `beforeError` hook, use `error.data`, not `await error.response.json()`. Ky has already consumed that body. In a Tuyau error, use `error.response`; `error.rawResponse` remains available for status and headers, not for rereading the body.

## Keep Tuyau's URL configuration

Tuyau's `baseUrl` keeps its existing append semantics:

```ts
const client = createTuyau({ baseUrl: 'https://example.com/api', registry })
await client.get('/users', {})
// Requests https://example.com/api/users, not https://example.com/users.
```

Tuyau maps this to Ky's `prefix` option internally. Do not replace it with Ky's native `baseUrl`, which uses standard URL resolution. Per-request `prefix` and `baseUrl` overrides are not supported.

## Check custom Ky behavior

- `searchParams` now merges with parameters already in the request URL instead of replacing the whole query string. Tuyau still serializes its `query` option.
- Parsing an empty or 204 response as JSON rejects unless a custom `parseJson` handles the empty body. Tuyau classifies such parsing failures as `unknown`, not `network`.
- Ky's `timeout` remains a per-attempt timeout. Use `totalTimeout` to limit the full request lifecycle, including retries. Both produce Tuyau errors with kind `timeout`.
- Ky bounds HTTP error-body parsing. An empty, invalid, unreadable, oversized, or timed-out error body can leave `response` undefined. A configured `maxResponseSize` violation instead produces an `unknown` error; an exhausted `totalTimeout` produces a `timeout` error.
