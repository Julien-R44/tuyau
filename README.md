# Tuyau

> [!WARNING]
> Tuyau is still in early development. I will NOT follow semver until the first 1.0.0. Use at your own risk.

Set of tools to create typesafe APIs using AdonisJS. The monorepo includes the following packages:

- `@tuyau/core` : Core package that you must install in your AdonisJS project.
- `@tuyau/client` : E2E typesafe client to consume your AdonisJS APIs.
- `@tuyau/utils` : Set of utilities and helpers for the other packages.

## Goals of the project

The main goal of this project is to provide some utilities to have better typesafety when creating APIs with AdonisJS. Goals on the long term are :

- **Done** : Provide an RPC-like client that is fully e2e typesafe ( like tRPC, Elysia Eden, Hono etc. )
- **Not started** : Provide a [Ziggy](https://github.com/tighten/ziggy)-like helper to generate and use routes in the frontend.
- **Not started** : Provide a specific Controller class that will allow to have better typesafety when creating your endpoints.
- **Not started** : Having an automatic OpenAPI generation + Swagger/Scalar UI viewer.

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

```typescript
/// <reference path="../../adonisrc.ts" />

import { createTuyau } from '@tuyau/client'
import type { AdonisApi } from '@your-monorepo/server/.adonisjs/types/api'

export const tuyau = createTuyau<AdonisApi>('http://localhost:3333')
```

Multiple things to note here :

- We must reference the `adonisrc.ts` file at the top of the file. By doing that, the frontend project will be aware of some types defined in the AdonisJS project.
- We must import the `AdonisApi` type from the `.adonisjs/types/api` file in your AdonisJS project. You should change the path to match your project structure.

Now, you can use the `tuyau` object to make requests to your AdonisJS API. Here is an example :

```typescript
import { tuyau } from './tuyau'

const result = await tuyau.users.$get()
const result = await tuyau.users.$post({ name: 'John Doe' })

const result = await tuyau.users({ id: 1 }).$get()
const result = await tuyau.users({ id: 1 }).$put({ name: 'John Doe' })

const result = await tuyau.users.$get({
  query: { page: 1, limit: 10 },
})
```
