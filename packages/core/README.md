# @tuyau/core

Core package for Tuyau. Includes the backend integration and the E2E typesafe client to consume your AdonisJS APIs.

## Registry types

Each generated registry exports its own `Route` and `Path` type helpers. Their names and paths are limited to that registry.

```ts
import type { Route, Path } from '~generated/registry'

type User = Route.Response<'users.show'>
type CreateUser = Route.Body<'users.store'>
type UserParams = Path.Params<'GET', '/users/:id'>
```

Both helpers provide `Request`, `Response`, `Params`, `Body`, `Query`, and `Error`. `Route` accepts a route name. `Path` accepts an HTTP method and a URL pattern.

## Multiple registries

Several `generateRegistry` hooks can generate separate registries with independent route-name filters:

```ts
import { generateRegistry } from '@tuyau/core/hooks'

// Inside defineConfig in adonisrc.ts
hooks: {
	init: [
		generateRegistry({
			output: './.adonisjs/client/public',
			routes: { except: [/^admin\./] },
			typeAugmentation: false,
		}),
		generateRegistry({
			output: './.adonisjs/client/admin',
			routes: { only: [/^admin\./] },
			typeAugmentation: false,
		}),
	],
},
```

Each client receives its own registry through `createTuyau({ registry, baseUrl })`. Type imports can coexist in the same TypeScript program:

```ts
import type { Route as PublicRoute } from '~generated/public'
import type { Route as AdminRoute } from '~generated/admin'

type User = PublicRoute.Response<'users.show'>
type Dashboard = AdminRoute.Response<'admin.dashboard'>
```

`typeAugmentation` defaults to `true` for compatibility with the global `Route` and `Path` helpers exported by `@tuyau/core/types`. At most one registry in a TypeScript program can enable it. This also applies when a `tsconfig` includes generated files without importing them.

**AdonisJS Inertia still requires the global augmentation for route typing.** Its React and Vue `Link`, `Form`, `useRouter`, and `useHttp` helpers read `UserRegistry`. Keep `typeAugmentation: true` on the registry used by Inertia and disable it on the other registries. The local helpers do not replace Inertia's global route selection.

Tuyau's React Query, Vue Query, and Svelte Query integrations infer routes from their client and do not require this augmentation.

## License

MIT
