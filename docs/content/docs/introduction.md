---
summary: A set of tools to create typesafe APIs with AdonisJS, including an E2E client like tRPC, Inertia helpers, Ziggy-like and more.
---

# Introduction

![](https://static.julr.dev/tuyau.png)

A set of tools to create typesafe APIs with AdonisJS, including an E2E client like tRPC, Inertia helpers, Ziggy-like and more.

- **E2E typesafe client**: Generate a client to consume your AdonisJS API with 100% typesafety.
- **Ziggy-like helper**: Generate and use routes in the frontend with typesafety.
- **OpenAPI generation**: Generate an OpenAPI definition from your AdonisJS project based on Tuyau codegen.
- **Inertia helpers**: A set of components and helpers for AdonisJS + Inertia projects.

## Project Goals

The main goal of this project is to provide utilities for better typesafety when creating APIs with AdonisJS. Long-term goals include:

- **Done** : Provide an RPC-like client that is fully e2e typesafe ( like tRPC, Elysia Eden, Hono etc. )
- **Done** : Provide a [Ziggy](https://github.com/tighten/ziggy)-like helper to generate and use routes in the frontend.
- **Done (Experimental)** : Having an automatic OpenAPI generation + Swagger/Scalar UI viewer based on Tuyau codegen.
- **In Progress** : Provide some Inertia helpers to have better typesafety when using Inertia in your AdonisJS project. Things like typesafe `<Link />` and `useForm`.
- **Not started** : Provide a specific Controller class that will allow to have better typesafety when creating your endpoints.
- **Not started**: Having a Tanstack-Query integration for the client package. Like [tRPC](https://trpc.io/docs/client/react) or [ts-rest](https://ts-rest.com/docs/vue-query) does.

## E2E/RPC-like Client? What does that mean?

Imagine you have an AdonisJS API ready to use, and you want to consume it in your frontend React/Vue or another framework. Typically, you'd create a class or file that contains methods to call the various routes of your API:

```typescript
export class MyAPI {
  async getPosts(options) {
    return fetch(
      `/posts?page=${options.page}&limit=${options.limit}`
    )
  }

  async getPost(id: number) {
    return fetch(`/posts/${id}`)
  }
}
```

This works, but there’s no type safety. There’s no information about the data being sent or received. Also boring code to write. The next step is usually to create types for the data:

```typescript
interface Post {
  id: number
  title: string
}

interface GetPostsOptions {
  page?: number
  limit?: number
}

export class MyAPI {
  async getPosts(options: GetPostsOptions): Promise<Post[]> {
    return fetch(
      `/posts?page=${options.page}&limit=${options.limit}`
    )
  }

  async getPost(id: number): Promise<Post> {
    return fetch(`/posts/${id}`)
  }
}
```

While this is better, we still have the problem of keeping types in sync. If a field name changes in your API, you’ll need to update it in the client too, leading to a high risk of desynchronization between the backend and frontend. It can also be tedious to create these types repeatedly.

This is a naive approach, but you get the idea.

Tuyau offers an alternative method: a frontend client generated automatically from your AdonisJS API, which will be 100% typesafe without maintaining any types or runtime code yourself. Tuyau uses codegen to detect input and output types for your routes. Taking the same API example, here’s how you could use it with Tuyau:

```typescript
// In your frontend
import { createTuyau } from '@tuyau/client'
import { api } from '@your-monorepo/my-adonisjs-app/.adonisjs/api'

export const tuyau = createTuyau({
  api,
  baseUrl: 'http://localhost:3333',
})

const posts = tuyau.posts.$get({ page: 1, limit: 10 })
const post = tuyau.posts({ id: 1 }).$get()
```

Everything in this example is fully typesafe: parameters (like `/posts/:id`), payloads, query params, and responses. You can leverage TypeScript's power to avoid a lot of errors: missing response properties, forgotten request parameters, or typos in payload fields. TypeScript will notify you, and your code won’t compile until it’s corrected.

If you’re familiar with [tRPC](https://trpc.io/docs/client/react), [Elysia Eden](https://elysia.dev/), or [Hono](https://hono.dev/), it’s the same concept.

## How does it work?

Tuyau uses codegen to generate input and output types for your AdonisJS routes. You’ll need to run the command `node ace tuyau:generate` whenever you add a new route to your project. This will generate a `.adonisjs/api.ts` file containing the following information:

- Input types for your routes’ payloads, defined using [VineJS](https://vinejs.dev/).
- Output types for your routes, inferred automatically from your controller methods' return types.
- The route names of your project, allowing you to access them without explicitly defining URLs.

For example, in a project like this:

```typescript
import { HttpContext } from '@adonisjs/http-server'
import { vine } from 'vinejs'

export const getPostsValidator = vine.compile(
  vine.object({
    page: vine.number().optional(),
    limit: vine.number().optional(),
  })
)

export class PostsController {
  public async index({ request }: HttpContext) {
    const payload = await request.validateUsing(getPostsValidator)

    return [
      { id: 1, title: 'Hello World' },
      { id: 2, title: 'Hello World 2' },
    ]
  }
}

router.get('/posts', [PostsController, 'index']).as('posts.index')
```

This would generate a `.adonisjs/api.ts` file that looks like that. This one is highly simplified just to give you an idea :

```typescript
type Api = {
  posts: {
    $get: {
      input: {
        page?: number
        limit?: number
      }
      output: {
        id: number
        title: string
      }[]
    }
  }
}
```

That’s the general idea. We’ll cover more details in the following pages.

## Sponsor

If you like this project, [please consider supporting it by sponsoring](https://github.com/sponsors/Julien-R44/). Your support will help maintain and improve it. Thanks a lot!

## Prior art and inspirations

- [tRPC](https://trpc.io/docs/client/react)
- [Elysia Eden](https://elysia.dev/)
- [Hono](https://hono.dev/)
- [Ziggy](https://github.com/tighten/ziggy)
