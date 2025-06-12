# @tuyau/client

## 0.2.9

### Patch Changes

- Updated dependencies [3c43a07]
  - @tuyau/utils@0.0.8

## 0.2.8

### Patch Changes

- c738d34: Improve TuyauHTTPError message to be more informative

## 0.2.7

### Patch Changes

- d7fc509: Fix $current returning PUT/POST methods. See https://github.com/Julien-R44/tuyau/issues/54
- 3266a06: Fix when returning a 2xx status code ( that is not 201 ), the response type of `unwrap` was `unknown`. See #45
- 9d24bbb: $route not including query parameters on GET request. See https://github.com/Julien-R44/tuyau/issues/55

## 0.2.6

### Patch Changes

- ad866b3: Fix `$current` that was broken when used with Vite because of a sub-dependency that was not correctly resolved.

  Close [#41](https://github.com/Julien-R44/tuyau/issues/41)

## 0.2.5

### Patch Changes

- faa2ba6: Added a basic plugin system for the client.

  ```ts
  import type { TuyauPlugin } from '@tuyau/client'

  export function myPlugin(): TuyauPlugin {
    return ({ options }) => {
      // Do something with the options object. You can mutate them
      // as you wish.
    }
  }

  export const tuyau = createTuyau({
    api,
    baseUrl: `http://localhost:3333`,
    plugins: [myPlugin()],
  })
  ```

- Updated dependencies [dc0e6bf]
  - @tuyau/utils@0.0.7

## 0.2.4

### Patch Changes

- 26d3dcf: Fix for a bug when using the `$url` function on routes with multiple parameters that were not defined with snake_case on the AdonisJS side.

  For example:

  ```ts
  router.get('/posts/:postId/comments/:commentId', '...').as('posts.comments')
  tuyau.$url('posts.comments', { postId: 1, commentId: 2 })
  ```

  This code would throw an error stating that the parameters were not defined

## 0.2.3

### Patch Changes

- cb64666: Calling `$route` method was causing an error. See #30. This commit fixes the issue.

## 0.2.2

### Patch Changes

- e40e327: Add @tuyau/utils to prod dependencies
- 18aacee: Query params are now allowed when building an URL with `$url`. See https://github.com/Julien-R44/tuyau/issues/25

## 0.2.1

### Patch Changes

- 4774ad4: Fix when cookie is not preset

## 0.2.0

### Minor Changes

- ab51d40: Now the client will automatically add the CSRF token in the headers of each request when present in the cookies, exactly like Axios does.

  Related #21

## 0.1.3

### Patch Changes

- 76569fa: Incorrect TuyauResponse typing. Fix #11

## 0.1.2

### Patch Changes

- 793a775: Add $current helper to check the current route. You can use the `$current` method to get or check the current route :

  ```ts
  // Current window location is http://localhost:3000/users/1/posts/2, route name is users.posts.show
  tuyau.$current() // users.posts
  tuyau.$current('users.posts.show') // true
  tuyau.$current('users.*') // true
  tuyau.$current('users.edit') // false
  ```

  You can also specify route parameters or query parameters to check :

  ```ts
  tuyau.$current('users.posts.show', { params: { id: 1, postId: 2 } }) // true
  tuyau.$current('users.posts.show', { params: { id: 12 } }) // false
  tuyau.$current('users.posts.show', { query: { page: 1 } }) // false
  ```

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

## 0.0.9

### Patch Changes

- Fix query params
