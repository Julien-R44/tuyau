---
summary: Setup Tuyau in your application
---

# Installation

:::warning
- Tuyau is an ESM-only package. You will also need Node.js 18 or higher.
- This guide will assume you have a monorepo with your AdonisJS project, and your frontend project. As with most E2E client tools, it is highly recommended to have a monorepo to facilitate the generation and use of the client.
:::

First make sure to install the code package in your AdonisJS project : 

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

**This command will NOT run automatically for now. You will need to run it manually after some specific changes in your AdonisJS project :**

- After adding a new route/controller in your project
- After adding a `request.validateUsing` call in your controller method.

Other than that, you will not need to run this command. Let's say you update the return type of a controller method, or you update the Vine schema : **you DON'T need to run the command.**

Later on, we will use the [`onSourceFileChanged` hook](https://docs.adonisjs.com/guides/experimental-assembler-hooks#onsourcefilechanged) to run the command automatically when needed.

To run the command manually, you must run :

```bash
node ace tuyau:generate
```

And an appropriate `.adonisjs/api.ts` file will be generated in your project.

### Sharing the API definition

The command will generate a file called `.adonisjs/api.ts` in your project. This file will contain the definition of your API. You must export this file in your project to use the client package.

So, let's say your monorepo structure is like this :

```
apps
  frontend
  server
```

You must export the `.adonisjs/api.ts` file from your server workspace using [subpath exports](https://nodejs.org/api/packages.html#subpath-exports) : 

```jsonc
// package.json
{
  "name": "@acme/server",
  "type": "module",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./api": "./.adonisjs/api.ts"
  },
}
```

Once done, make sure to include `@acme/server` as a dependency in your frontend workspace :

```jsonc
// package.json
{
  "name": "@acme/frontend",
  "type": "module",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@acme/server": "workspace:*"
  }
}
```

:::warning
Make sure you package manager or monorepo tool is able to resolve the `workspace:*` syntax. If not, you will need to use whatever syntax your tool is using.
:::

Then you should be able to import the API definition in your frontend project :

```ts
import { api } from '@acme/server/api'
```

#### Initializing the client

Once installed, you must create the tuyau client in your frontend project : 

```ts
/// <reference path="../../adonisrc.ts" />

import { createTuyau } from '@tuyau/client'
import { api } from '@your-monorepo/server/.adonisjs/api'

export const tuyau = createTuyau({
  api,
  baseUrl: 'http://localhost:3333',
})
```

Multiple things to note here :

- We must reference the `adonisrc.ts` file at the top of the file. By doing that, the frontend project will be aware of some types defined in the AdonisJS project.
- We must import `api` from the `.adonisjs/api` file in your AdonisJS project. You should change the path to match your project structure.
- As you can see, the `api` is not a type, but a real object. You may ask why ? `api` is an object that contains two things :
  - The definition of you API. This is just a type. No runtime code for that.
  - The routes of your API. This is a "real" object that contains all the routes with their names and paths. Since we need to map the route names to the paths, we need to have some runtime code for that.

If you are not interested in using the route names in your frontend project, you can just import the `ApiDefinition` type from the `@tuyau/client` package and ignore the `api` object :

```ts
/// <reference path="../../adonisrc.ts" />

import { createTuyau } from '@tuyau/client'
import type { ApiDefinition } from '@your-monorepo/server/.adonisjs/api'

export const tuyau = createTuyau<{ definition: ApiDefinition }>({
  baseUrl: 'http://localhost:3333',
})
```

By doing that, you will not have additional runtime code in your frontend project but you will lose the ability to use the route names in your frontend project ( `$has`, `$current`, `$route` and other route helpers ). However, you will still benefit from the typesafety of the API definition when calling your routes by their path ( e.g. `tuyau.users.$get()` ).
