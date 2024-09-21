---
'@tuyau/core': minor
---

See https://github.com/Julien-Sponsors/tuyau/issues/4

Basically we allow the use of a validator directly in the controller file. For example:

```ts
export const myValidator = vine.compile(
  vine.object({
    id: vine.number()
  }),
)

export default class MyController {
  public async handle({ request }: HttpContext) {
    const payload = await request.validateUsing(myValidator)
    // ...
  }
}
```

It didn't work before. Now it's possible
