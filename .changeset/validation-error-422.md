---
'@tuyau/core': minor
---

Auto-add typed 422 validation error response for routes using a validator. The generated error type uses `SimpleError` from `@vinejs/vine/types`. Can be customized via `validationErrorType` option or disabled with `validationErrorType: false`.

Also adds `isValidationError()` as an alias for `isStatus(422)`.

```ts
const { data, error } = await tuyau.api.users.store.$post.safe({
  body: { email: 'foo@bar.com', password: 'secret' },
})

if (error.isValidationError()) {
  // error.response is typed as { errors: SimpleError[] }
  for (const err of error.response.errors) {
    console.log(err.field, err.message)
  }
}
```
