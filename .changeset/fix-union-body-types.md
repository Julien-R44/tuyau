---
'@tuyau/core': patch
---

Fix body type not being recognized when using `vine.group` with `.merge()` in validators.

Previously, validators like this would cause tuyau to lose the `body` type, resulting in `'body' does not exist in type 'BaseRequestOptions'`:

```ts
const createSessionValidator = vine.create(
  vine.object({}).merge(
    vine.group([
      vine.group.if((data) => data.password, { password: vine.string() }),
      vine.group.if((data) => data.assertion, { assertion: webauthnAssertion }),
    ])
  )
)
```

The tuyau client now correctly accepts both variants of the union:

```ts
// Both calls are now properly typed
await client.session.store({ body: { password: 'secret' } })
await client.session.store({ body: { assertion: { id: '...', rawId: '...' } } })
```
