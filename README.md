![banner](https://static.julr.dev/tuyau.png)

> [!WARNING]
> Tuyau is still in early development. I will **NOT follow semver until 1.0.0**. Use at your own risk.

Set of tools to create typesafe APIs using AdonisJS. The monorepo includes the following packages:

- `@tuyau/core` : Core package that you must install in your AdonisJS project.
- `@tuyau/utils` : Set of utilities and helpers for the other packages.
- `@tuyau/client` : E2E typesafe client to consume your AdonisJS APIs.
- `@tuyau/inertia` : Set of components and helpers for AdonisJS + Inertia projects.
- `@tuyau/openapi` : Experimental package to generate a "not-so-bad" OpenAPI definition from your AdonisJS project based on the Tuyau codegen.

See documentation at [tuyau.julr.dev](https://tuyau.julr.dev).

## Goals of the project

The main goal of this project is to provide some utilities to have better typesafety when creating APIs with AdonisJS. Goals on the long term are :

- **Done** : Provide an RPC-like client that is fully e2e typesafe ( like tRPC, Elysia Eden, Hono etc. )
- **Done** : Provide a [Ziggy](https://github.com/tighten/ziggy)-like helper to generate and use routes in the frontend.
- **Done (Experimental)** : Having an automatic OpenAPI generation + Swagger/Scalar UI viewer based on Tuyau codegen.
- **In Progress** : Provide some Inertia helpers to have better typesafety when using Inertia in your AdonisJS project. Things like typesafe `<Link />` and `useForm`.
- **Not started** : Provide a specific Controller class that will allow to have better typesafety when creating your endpoints.
- **Not started**: Having a Tanstack-Query integration for the client package. Like [tRPC](https://trpc.io/docs/client/react) or [ts-rest](https://ts-rest.com/docs/vue-query) does.

## Sponsors

If you like this project, [please consider supporting it by sponsoring it](https://github.com/sponsors/Julien-R44/). It will help a lot to maintain and improve it. Thanks a lot !

![](https://github.com/julien-r44/static/blob/main/sponsorkit/sponsors.png?raw=true)
