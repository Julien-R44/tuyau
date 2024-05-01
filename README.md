![banner](./assets/banner.png)

> [!WARNING]
> Tuyau is still in early development. I will **NOT follow semver until 1.0.0**. Use at your own risk.

Set of tools to create typesafe APIs using AdonisJS. The monorepo includes the following packages:

- `@tuyau/core` : Core package that you must install in your AdonisJS project.
- `@tuyau/client` : E2E typesafe client to consume your AdonisJS APIs.
- `@tuyau/utils` : Set of utilities and helpers for the other packages.

## Goals of the project

The main goal of this project is to provide some utilities to have better typesafety when creating APIs with AdonisJS. Goals on the long term are :

- **Done (Experimental)** : Provide an RPC-like client that is fully e2e typesafe ( like tRPC, Elysia Eden, Hono etc. )
- **In Progress** : Provide a [Ziggy](https://github.com/tighten/ziggy)-like helper to generate and use routes in the frontend.
- **Not started** : Provide some Inertia helpers to have better typesafety when using Inertia in your AdonisJS project. Things like typesafe `<Link />` and `useForm`.
- **Not started** : Provide a specific Controller class that will allow to have better typesafety when creating your endpoints.
- **Not started** : Having an automatic OpenAPI generation + Swagger/Scalar UI viewer based on Tuyau codegen. Still not sure about this one.

## Installation

First make sure to install the core package in your AdonisJS project:

```bash
node ace add @tuyau/core
```

Then, you can install the client package in your frontend project:

```bash
pnpm add @tuyau/client
```

## Usage

### Core package

The core package expose a single command called `node ace tuyau:generate`. This command will generate the typescript types needed for the client package to work.

This command will NOT run automatically for now. You will need to run it manually after some specific changes in your AdonisJS project :

- When adding a new route/controller in your project
- When adding a `request.validateUsing` call in your controller method.

Other than that, you will not need to run this command. Let's say you update the return type of a controller method, or you update the Vine schema : you DON'T need to run the command.

Later on, we will use the [`onSourceFileChanged` hook](https://docs.adonisjs.com/guides/experimental-assembler-hooks#onsourcefilechanged) to run the command automatically when needed.

To run the command manually, you must run :

```bash
node ace tuyau:generate
```

### Client package

Once installed, you must create a file called `tuyau.ts` in your frontend project. This file must contain the following code :

```ts
/// <reference path="../../adonisrc.ts" />

import { createTuyau } from '@tuyau/client'
import type { AdonisApi } from '@your-monorepo/server/.adonisjs/types/api'

export const tuyau = createTuyau<AdonisApi>('http://localhost:3333')
```

Multiple things to note here :

- We must reference the `adonisrc.ts` file at the top of the file. By doing that, the frontend project will be aware of some types defined in the AdonisJS project.
- We must import the `AdonisApi` type from the `.adonisjs/types/api` file in your AdonisJS project. You should change the path to match your project structure.


#### Initializing the client

Once installed, you must create the tuyau client in your frontend project : 

```ts
/// <reference path="../../adonisrc.ts" />

import { createTuyau } from '@tuyau/client'
import type { AdonisApi } from '@your-monorepo/server/.adonisjs/types/api'

export const tuyau = createTuyau<AdonisApi>('http://localhost:3333')
```

Multiple things to note here :

- We must reference the `adonisrc.ts` file at the top of the file. By doing that, the frontend project will be aware of some types defined in the AdonisJS project.
- We must import the `AdonisApi` type from the `.adonisjs/types/api` file in your AdonisJS project. You should change the path to match your project structure.

##### Options

Tuyau client is built on top of [Ky](https://github.com/sindresorhus/ky). Make sure to check the documentation of Ky to see all the available options. You can pass options to the client like this :

```ts
const tuyau = createTuyau<AdonisApi>('http://localhost:3333', {
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

#### Making requests

Making requests with Tuyau is pretty straightforward. Basically, what you need to chain the different parts of the route you want to call, use `.` instead of `/` and finally call the `$method` you want to use.

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

#### Path parameters

If you need to call a route that has some path parameters, you can pass an object to the related function. Here is an example :

```ts
// Backend
router.get('/users/:id/posts/:postId/comments/:commentId', '...')

// Frontend
const result = await tuyau.users({ id: 1 })
  .posts({ postId: 2 })
  .comments({ commentId: 3 })
  .$get()
```

#### Request Parameters

You can pass specific `Ky` options to the request by passing a second argument to the request method : 

```ts
await tuyau.users.$post({ name: 'John Doe' }, {
  headers: {
    'X-Custom-Header': 'foobar'
  }
})
```

When using the `$get` method you can pass a `query` object to the request : 

```ts
await tuyau.users.$get({
  headers: {
    'X-Custom-Header': 'foobar'
  },
  query: {
    page: 1,
    limit: 10
  }
})
```

#### Responses

For every request, Tuyau will return a promise with the following types : 

- `data` : The response data if status is 2xx
- `error` : The error data if status is 3xx
- `status` : The status code of the response
- `response` : The full response object

Once returned, you must narrow the type of the response. That means you must check if the status is 2xx or 3xx and then use the `data` or `error` property accordingly. 

Let's take a dumb example. A simple route that will return a 401 if the password is not `password`, otherwise it will return a secret token :

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

Without narrowing the type of the response, `data` and `error` could be `undefined`, so you must check that in your code before using them.

##### Unwrapping the response

Sometimes, you may not want to check or handle the error specifically in your code. You can use the `unwrap` method to unwrap the response and throw an error if the status is not 2xx.

```ts
const result = await tuyau.login.$post({ email: 'foo@ok.com' }).unwrap()
console.log(result.token)
```

#### Infering request and responses

The client package expose some helpers for inferring the request and response types of a route. Here is an example :

```ts
import type { InferResponseType, InferErrorType, InferRequestType } from '@tuyau/client';

// InferResponseType
type LoginRequest = InferRequestType<typeof tuyau.login.post>;

// InferResponseType
type LoginResponse = InferResponseType<typeof tuyau.login.post>;

// InferErrorType
type LoginError = InferErrorType<typeof tuyau.login.post>;
```

#### Generating URL

If you need to generate the URL of a route without making the request, you can use the `$url` method :

```ts
const url = tuyau.users.$url()
console.log(url) // http://localhost:3333/users

const url = tuyau.users({ id: 1 }).posts({ postId: 2 }).$url()
console.log(url) // http://localhost:3333/users/1/posts/2
```

## Credits

Tuyau was inspired a lot by [Elysia](https://elysiajs.com/eden/treaty/overview), [tRPC](https://trpc.io/) and [Hono](https://hono.dev/). Thanks to the authors of these projects for the inspiration !
