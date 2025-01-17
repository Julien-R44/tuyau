---
summary: Setup a Monorepo with AdonisJS, Next.js and Tuyau
---

# Setup Tuyau with Next.js

In this guide, we'll be setting up a Monorepo with AdonisJS, Next.js and Tuyau.

:::tip
You can find an example of it in this [repository](https://github.com/mohitxskull/tuyau-nextjs-adonisjs-stackblitz-demo).
:::

We'll be using `pnpm` to manage the dependencies in our Monorepo.

Let's create an empty folder called `acme` and initialize `package.json` with `pnpm` :

```sh
pnpm init
```

Now we need to tell `pnpm` where our apps are located in the folder and for that we need to add a `apps` folder and [`pnpm-workspace.yaml`](https://pnpm.io/workspaces) file as `pnpm` do not support the `workspaces` field in `package.json`:

```yaml
# pnpm-workspace.yaml
packages:
    - apps/*
```

As a result, we'll have a `acme` folder with the following structure:

```
acme
├── package.json
├── apps
└── pnpm-workspace.yaml
```

## Adding AdonisJS

Now let's do a `cd` to our `apps` folder and create a AdonisJS project:

```sh
pnpm create adonisjs@latest backend
```

For more information on creating an AdonisJS project, check out [this guide](https://docs.adonisjs.com/guides/getting-started/installation).

```
acme
├── package.json
├── apps
├── apps/backend
└── pnpm-workspace.yaml
```

### Adding Tuyau to AdonisJS

You should now install Tuyau core package in your AdonisJS project. For installation and configuration, check out the [installation](/docs/installation) guide.

## Adding Next.js

To create a Next.js project, run the following command in `./acme/apps` folder:

```sh
pnpx create-next-app@latest frontend --typescript
```

For more information on creating a Next.js project, check out [create-next-app](https://nextjs.org/docs/getting-started/installation).

```
acme
├── package.json
├── apps
├── apps/backend
├── apps/frontend
└── pnpm-workspace.yaml
```

### Initializing the client in Next.js

Now let's initialize the client in the Next.js project. Create a `tuyau.ts` file in the `./acme/apps/frontend/lib/tuyau.ts` :

```ts
import { createTuyau } from '@tuyau/client'
import { api } from '@acme/server/api'

export const tuyau = createTuyau({
  api,
  baseUrl: 'http://localhost:3333',
})
```

For more details, follow the [installation](/docs/installation) guide from [here](/docs/installation#initializing-the-client).

### Configuration

As we are directly importing `.ts` files into our Next.js project, we must configure the `tsconfig.json` and `next.config.ts` files.

```ts
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@acme/backend'],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };
    return config;
  },
};

export default nextConfig;
```

Decorators are not enabled by default in TypeScript, So we need to enable them in `tsconfig.json` else we'll see errors during `tsc --noEmit` (typecheck).

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### Typechecking

We have successfully created a Monorepo with AdonisJS, Next.js and Tuyau, but let's try if everything is working as expected.

For that add the `typecheck` script to the `package.json` in `./acme/apps/frontend`:

```json
// package.json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

Run the `typecheck` script and see if everything is working as expected.

If you see any errors coming from `../backend` folder, check them and if they are related to missing types, add required reference files in your frontend project :

```ts
/// <reference path="../config/auth.ts" />
```

As your project grows you may need to add more reference files here.

