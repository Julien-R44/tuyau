---
summary: Generate an OpenAPI specification for your API from the Tuyau codegen.
---

# OpenAPI package

:::warning
OpenAPI package is still experimental and may not work as expected. Please feel free to open an issue if you encounter any problem.

In fact, I am not sure if this package will be kept in the future. For now, this is just a test to see how far we can go with Tuyau's codegen.
:::

The `@tuyau/openapi` package allows you to generate an OpenAPI specification for your API from the Tuyau codegen. The specification is generated from the types of routes and validation schemas, using the Typescript compiler and `ts-morph`. Therefore, it has some limitations compared to manually written specifications (whether via decorators, JS doc, YAML files, or Zod schemas describing the inputs/outputs of the routes).

During development, the specification will be generated on the fly with each request, which can take a bit of time for large APIs with many routes. In production, the specification will be generated at build time into a `.yml` file and the same specification will be served for each request.

### Installation

To install the package, you will obviously need to have the `@tuyau/core` package already installed in your AdonisJS project. Then, you can install the `@tuyau/openapi` package:

```bash
node ace add @tuyau/openapi
```

### Usage

Once the package is configured, you can directly access your API's OpenAPI specification at the `/docs` address. The `/openapi` route is also available to directly access the OpenAPI specification.

### Customizing the Specification

To customize the specification, the package exposes `openapi` macros on the routes. These macros allow you to add additional information to the OpenAPI specification. For example, you can add tags, descriptions, responses, parameters, etc.

```ts
router.group(() => {
  router
    .get("/random", [MiscController, "index"])
    .openapi({ summary: "Get a random thing" });

  router
    .get("/random/:id", [MiscController, "show"])
    .openapi({ summary: "Get a random thing by id" });
})
  .prefix("/misc")
  .openapi({ tags: ["misc"] });
```

Feel free to use your editor's autocomplete to see all available options.

Also, from the `config/tuyau.ts` file, you have the ability to customize the OpenAPI specification with the `openapi.documentation` property:

```ts
const tuyauConfig = defineConfig({
  openapi: {
    documentation: {
      info: { title: 'My API!', version: '1.0.0', description: 'My super API' },
      tags: [
        { name: 'subscriptions', description: 'Operations about subscriptions' },
      ],
    },
  },
});
```

### Configuration

The package configuration is done via the `config/tuyau.ts` file, under the `openapi` key. The available options are as follows:

#### `provider`

The OpenAPI viewer to use. Two providers are available: `swagger-ui` and `scalar`. By default, the `scalar` provider is used.

#### `exclude`

Paths to exclude from the OpenAPI specification. By default, no paths are excluded. You can pass an array of strings or regex.

Example:

```ts
const tuyauConfig = defineConfig({
  openapi: {
    exclude: ['/health', /admin/]
  }
});
```

#### `endpoints`

The endpoints where the OpenAPI specification and documentation will be available. By default, the OpenAPI specification will be available at `/openapi` and the documentation at `/docs`.

Example:

```ts
const tuyauConfig = defineConfig({
  openapi: {
    endpoints: {
      spec: '/my-super-spec',
      ui: '/my-super-doc'
    }
  }
});
```

#### `scalar`

The options to pass to the `scalar` provider when used. More details [here](https://github.com/scalar/scalar?tab=readme-ov-file#configuration).

#### `swagger-ui`

The options to pass to the `swagger-ui` provider when used. More details [here](https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/).
