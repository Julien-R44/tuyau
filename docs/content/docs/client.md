---
summary: How to use Tuyau RPC / E2E Client in your AdonisJS project
---

# Client

As mentioned in the [installation](./installation.md), we used `createTuyau` to create our client instance. This instance will be used to make requests to our API. The following options are available:

## Options

### `api`

The `api` object is the generated API definition from your AdonisJS project. This object contains everything needed for Tuyau to work. It contains the routes, the types, the definitions, etc.

```ts
import { api } from '@your-monorepo/server/.adonisjs/api'

export const tuyau = createTuyau({
  api,
  baseUrl: 'http://localhost:3333',
})
```

As you can see, the `api` is not a type, but a real runtime object. You might ask, why? The `api` is an object that contains two things:
  - The definition of your API. This is just a type with no runtime code.
  - The routes of your API. This is a "real" object that contains all the routes with their names and paths. Since we need to map the route names to paths, we need some runtime code for that.

If you're not interested in using the route names in your frontend project, you can simply import the `ApiDefinition` type from the `@tuyau/client` package and ignore the `api` object:

```ts
/// <reference path="../../adonisrc.ts" />

import { createTuyau } from '@tuyau/client'
import type { ApiDefinition } from '@your-monorepo/server/.adonisjs/api'

export const tuyau = createTuyau<{ definition: ApiDefinition }>({
  baseUrl: 'http://localhost:3333',
})
```

To clarify, if you don't need to use methods like `tuyau.$url('users.posts.show', { id: 1, postId: 2 })`, `$tuyau.route`, or the `Link` component from `@tuyau/inertia`, you can ignore the `api` object and only pass the `ApiDefinition` type to `createTuyau`.

### `baseUrl`

The `baseUrl` option is the base URL of your API.

```ts
export const tuyau = createTuyau({
  api,
  baseUrl: 'http://localhost:3333',
})
```

### Other options

The Tuyau client is built on top of [Ky](https://github.com/sindresorhus/ky). So you can pass any options supported by Ky. Here's an example with some options:

```ts
const tuyau = createTuyau({
  api,
  baseUrl: 'http://localhost:3333',
  timeout: 10_000,
  headers: { 'X-Custom-Header': 'foobar' },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getToken()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      }
    ]
  }
})
```

## Making requests

Making requests with Tuyau is pretty straightforward. Essentially, you need to chain the different parts of the route you want to call using `.` instead of `/` and then call the `$method` you want to use. Let's look at some examples:

```ts
import { tuyau } from './tuyau'

// GET /users
await tuyau.users.$get()

// POST /users { name: 'John Doe' }
await tuyau.users.$post({ name: 'John Doe' })

// PUT /users/1 { name: 'John Doe' }
await tuyau.users({ id: 1 }).$put({ name: 'John Doe' })

// GET /users/1/posts?limit=10&page=1
await tuyau.users.$get({ query: { page: 1, limit: 10 } })
```

## Making Requests using the route name

If you prefer to use route names instead of paths, you can use the `$route` method:

```ts
// Backend
router.get('/posts/:id/generate-invitation', '...')
  .as('posts.generateInvitation')

// Client
await tuyau
  .$route('posts.generateInvitation', { id: 1 })
  .$get({ query: { limit: 10, page: 1 } })
```

## Path parameters

When calling a route with path parameters, pass an object to the related function. For example:

```ts
// Backend
router.get('/users/:id/posts/:postId/comments/:commentId', '...')

// Frontend
const result = await tuyau.users({ id: 1 })
  .posts({ postId: 2 })
  .comments({ commentId: 3 })
  .$get()
```

## Request Parameters

You can pass specific `Ky` options to the request by providing them as a second argument to the request method:

```ts
await tuyau.users.$post({ name: 'John Doe' }, {
  headers: {
    'X-Custom-Header': 'foobar'
  }
})
```

When using the `$get` method, you can pass a `query` object to the request:

```ts
await tuyau.users.$get({
  headers: { 'X-Custom-Header': 'foobar' },
  query: { page: 1, limit: 10 }
})
```

Note that the `query` object will automatically be serialized into a query string with the following rules:

- If the value is an array, it will be serialized using the `brackets` format. For example, `{ ids: [1, 2, 3] }` will be serialized as `ids[]=1&ids[]=2&ids[]=3`.
- If the value is null or undefined, it will be ignored and not added to the query string.

## File uploads

You can pass `File` instances to the request to upload files. Here's an example:

```html
<input type="file" id="file" />
```

```ts
const fileInput = document.getElementById('file') as HTMLInputElement
const file = fileInput.files[0]

await tuyau.users.$post({ avatar: file })
```

When a `File` instance is passed, Tuyau will automatically convert it to a `FormData` instance and set the appropriate headers. The payload will be serialized using the [`object-to-formdata`](https://www.npmjs.com/package/object-to-formdata) package.

If you're using React Native, pass your file as follows:

```ts
await tuyau.users.$post({ 
  avatar: { 
    uri: 'file://path/to/file',
    type: 'image/jpeg',
    name: 'avatar.jpg'
  } 
})
```

## Responses

For every request, Tuyau returns a promise with the following types:

- `data`: The response data if the status is 2xx
- `error`: The error data if the status is 3xx
- `status`: The response's status code
- `response`: The full response object

You must narrow the type of the response. That means you should check if the status is 2xx or 3xx and use the `data` or `error` property accordingly.

Here's a simple example. A route returns a 401 if the password is incorrect; otherwise, it returns a secret token:

```ts
// Backend
class MyController {
  public async login({ request, response }) {
    const { email, password } = request.validateUsing(schema)
    if (password !== 'password') {
      return response.unauthorized({ message: 'Invalid credentials' })
    }

    return { token: 'secret-token' }
  }
}

router.post('/login', [MyController, 'login'])

// Frontend
const { data, error } = await tuyau.login.$post({ email: 'foo@ok.com', password: 'password' })

data
// ^? { token: string } | null

if (error?.status === 401) {
  console.error('Wrong password !!')
  return
}

console.log(data.token)
//          ^? { token: string }
// data.token will be available and unwrapped here
```

Without narrowing the response type, `data` and `error` could be `undefined`, so you must check before using them.

### Unwrapping the response

If you prefer not to handle errors in your code, you can use the `unwrap` method to unwrap the response and throw an error if the status is not 2xx.

```ts
const result = await tuyau.login.$post({ email: 'foo@ok.com' }).unwrap()
console.log(result.token)
```

## Inferring request and response types

The client package provides helpers to infer the request and response types of a route. For example:

```ts
import type { InferResponseType, InferErrorType, InferRequestType } from '@tuyau/client';

// InferRequestType
type LoginRequest = InferRequestType<typeof tuyau.login.post>;

// InferResponseType
type LoginResponse = InferResponseType<typeof tuyau.login.post>;

// InferErrorType
type LoginError = InferErrorType<typeof tuyau.login.post>;
```

## Generating URL

If you need to generate the URL of a route without making the request, you can use the `$url` method:

```ts
const url = tuyau.users.$url()
console.log(url) // http://localhost:3333/users

const url = tuyau.users({ id: 1 }).posts({ postId: 2 }).$url()
console.log(url) // http://localhost:3333/users/1/posts/2
```

### Generating URL from route name

To generate a

 URL using the route name, you can use the `$url` method. This is similar to how [Ziggy](https://github.com/tighten/ziggy) works:

```ts
// http://localhost:3333/users/1/posts/2
tuyau.$url('users.posts', { id: 1, postId: 2 })

// http://localhost:3333/venues/1/events/2
tuyau.$url('venues.events.show', [1, 2])

// http://localhost:3333/users?page=1&limit=10
tuyau.$url('users', { query: { page: 1, limit: 10 } })
```

If you're familiar with Ziggy and prefer a `route` method instead of `$url`, you can easily define a custom method in your client file:

```ts
export const tuyau = createTuyau({
  api,
  baseUrl: 'http://localhost:3333'
})

window.route = tuyau.$url.bind(tuyau)
```

You can then use the `route` method in your frontend code:

```tsx
export function MyComponent() {
  return (
    <div>
      <a href={route('users.posts', { id: 1, postId: 2 })}>Go to post</a>
    </div>
  )
}
```

## Checking the current route

Tuyau has helpers to check the current route. You can use the `$current` method to get or verify the current route:

```ts
// Current window location is http://localhost:3000/users/1/posts/2, route name is users.posts.show
tuyau.$current() // users.posts
tuyau.$current('users.posts.show') // true
tuyau.$current('users.*') // true
tuyau.$current('users.edit') // false
```

You can also specify route parameters or query parameters to check:

```ts
tuyau.$current('users.posts.show', { params: { id: 1, postId: 2 } }) // true
tuyau.$current('users.posts.show', { params: { id: 12 } }) // false
tuyau.$current('users.posts.show', { query: { page: 1 } }) // false
```

## Checking if a route exists

To check if a route name exists, you can use the `$has` method. You can also use wildcards in the route name:

```ts
tuyau.$has('users') // true
tuyau.$has('users.posts') // true
tuyau.$has('users.*.comments') // true
tuyau.$has('users.*') // true
tuyau.$has('non-existent') // false
```

## Filtering generated routes

If you need to filter the routes generated by Tuyau, you can use the `only` and `except` options in `config/tuyau.ts`:

```ts
export default defineConfig({
  codegen: {
    definitions: {
      only: [/users/],
      // OR
      except: [/users/]
    },

    routes: {
      only: [/users/],
      // OR
      except: [/users/]
    }
  }
})
```

You can use only one of `only` or `except` at the same time. Both options accept an array of strings, an array of regular expressions, or a function that receives the route name and returns a boolean.

`definitions` will filter the generated types in the `ApiDefinition` interface. `routes` will filter the route names generated in the `routes` object.

--- 

Let me know if you need any adjustments!
