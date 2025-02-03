# @tuyau/core

## 0.3.2

### Patch Changes

- dc0e6bf: `node ace tuyau:generate` will now generate different typing when `@tuyau/superjson` is installed. Because, when `@tuyau/superjson` is installed, the inferred type of returned data should not be "type-serialized" since this is the whole point of superjson
- Updated dependencies [dc0e6bf]
  - @tuyau/utils@0.0.7

## 0.3.1

### Patch Changes

- b6ddc27: Automatically install @tuyau/utils when configuring the package. See #27

## 0.3.0

### Minor Changes

- f82db72: Support static-defined validators. This kind of controller is now supported:

  ```ts
  export default class ListUsersController {
    static validator = vine.compile(vine.object({ limit: vine.number() }))

    async index() {
      await request.validateUsing(ListUsersController.validator)
    }
  }
  ```

## 0.2.3

### Patch Changes

- 8c8fe85: Add a //eslint-disable directive in the generated file to avoid linting errors.
- e40e327: Add @tuyau/utils to prod dependencies

## 0.2.2

### Patch Changes

- b515810: Automatically generates `.adonisjs/index.ts` to export routes with required types and definitions, eliminating manual type imports for backend route exports.
- 7678e36: Automatic 422 response if the request input is validated using `validateUsing`.

## 0.2.1

### Patch Changes

- 844d7a9: Fix #6

## 0.2.0

### Minor Changes

- df82585: See https://github.com/Julien-Sponsors/tuyau/issues/4

  Basically we allow the use of a validator directly in the controller file. For example:

  ```ts
  export const myValidator = vine.compile(
    vine.object({
      id: vine.number(),
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

## 0.1.4

### Patch Changes

- dae1f80: When a vine validator referenced in a `validateUsing` was imported with a `default export`, then the validator was not found. This is now fixed.

## 0.1.1

- Fix: The `node ace configure @tuyau/core` was failing due to a stub file not being copied correctly. This has been fixed.
- Fix: use `unknown` instead of an inexistent type when this same type hasn't been generated.

## 0.1.0

### Minor Changes

- e26f6b2: Lots of changes here. Tuyau now has a system that's a bit like [Ziggy](https://github.com/tighten/ziggy). Basically, we can use the names of our routes defined in AdonisJS, but in the frontend. Let's start by listing the breaking changes:

  ## Breaking Changes & Migration

  - You will first need to download the latest versions of `@tuyau/utils` `@tuyau/core` and `@tuyau/client` for everything to work correctly.
  - The codegen file has changed location. It is now located in `.adonisjs/api.ts`. You will therefore need to change the import path of your client to access this new file.
  - To initialise the client, you will now need to do the following:

    ```ts
    /// <reference path="../../adonisrc.ts" />

    import { createTuyau } from '@tuyau/client'
    import type { api } from '@your-monorepo/server/.adonisjs/api'

    export const tuyau = createTuyau({
      api,
      baseUrl: 'http://localhost:3333',
    })
    ```

    As you can see, you first need to change the import path and the imported value. Next, you need to pass this `api` object as an argument to the `createTuyau` function.

  Remember to re-generate your `.adonisj/api.ts` file via `node ace tuyau:generate`, and you should be fine for the rest.

  ## Features

  ### Making Requests using the route name

  If you want to use the names of the routes instead of paths, you can use the `$route` method :

  ```ts
  // Backend
  router.get('/posts/:id/generate-invitation', '...').as('posts.generateInvitation')

  // Client
  await tuyau.$route('posts.generateInvitation', { id: 1 }).$get({
    query: { limit: 10, page: 1 },
  })
  ```

  ### Generating URL from route name

  If you need to generate the URL of a route using the route name, you can use the `$url` method. This method is pretty similar to [Ziggy](https://github.com/tighten/ziggy) behavior :

  ```ts
  tuyau.$url('users.posts', { id: 1, postId: 2 }) // http://localhost:3333/users/1/posts/2
  tuyau.$url('venues.events.show', [1, 2]) // http://localhost:3333/venues/1/events/2
  tuyau.$url('users', { query: { page: 1, limit: 10 } }) // http://localhost:3333/users?page=1&limit=10
  ```

  If you are used to Ziggy and prefer to have a `route` method instead of `$url`, you can define a custom method in your client file pretty easily :

  ```ts
  export const tuyau = createTuyau({
    api,
    baseUrl: 'http://localhost:3333',
  })

  window.route = tuyau.$url.bind(tuyau)
  ```

  Then you can use the `route` method in your frontend code :

  ```tsx
  export function MyComponent() {
    return (
      <div>
        <a href={route('users.posts', { id: 1, postId: 2 })}>Go to post</a>
      </div>
    )
  }
  ```

  ### Check if a route exists

  If you need to check if a route name exists, you can use the `$has` method. You can also use wildcards in the route name :

  ```ts
  tuyau.$has('users') // true
  tuyau.$has('users.posts') // true
  tuyau.$has('users.*.comments') // true
  tuyau.$has('users.*') // true
  tuyau.$has('non-existent') // false
  ```
