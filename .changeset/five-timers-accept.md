---
'@tuyau/core': minor
---

Support static-defined validators. This kind of controller is now supported:

```ts
export default class ListUsersController {
  static validator = vine.compile(vine.object({ limit: vine.number() }))

  async index() {
    await request.validateUsing(ListUsersController.validator)
  }
}
```
