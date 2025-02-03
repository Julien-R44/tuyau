---
summary: SuperJSON is a superset of JSON that supports additional types like Date, RegExp, BigInt, and more. Tuyau can works with SuperJSON to serialize and deserialize data.
---

# SuperJSON

SuperJSON extends JSON by supporting additional types like `Date`, `RegExp`, `BigInt`, and more. This means you can return a `Date` or a `Set` from your API, and when receiving the data in your frontend, it will be automatically converted to the correct type.

Tuyau provides a specific package to work with [SuperJSON](https://github.com/flightcontrolhq/superjson) called `@tuyau/superjson`. Before proceeding, ensure that Tuyau is properly installed and configured in your project. Then, run the following command **in your backend project**:

```bash
node ace add @tuyau/superjson
```

This command adds a `superjson_middleware` entry to your `start/kernel.ts` file. The middleware will automatically serialize response data using SuperJSON when a `x-superjson` header is present in the request.

Next, install the same package in your frontend project:

```bash
pnpm add @tuyau/superjson
```

Then, you should include the plugin when calling `createTuyau` :

```ts
import { superjson } from '@tuyau/superjson/plugin'

export const tuyau = createTuyau({
  api,
  baseUrl: `http://localhost:3333`,
  plugins: [superjson()],
})
```

This plugin will add the `x-superjson` header to every request, ensuring that the API returns data in SuperJSON format, and will also parse the response data correctly using SuperJSON.

Now, go back to your API and run :

```sh
node ace generate:tuyau
```

Make sure to do it after installing `@tuyau/superjson` in your Adonis project, because Tuyau will generate different types when using SuperJSON.

That's it! Your AdonisJS API can now return Date, Map, Set, BigInt, and more, and they will be correctly handled in your frontend application.

## Limitations

As mentioned earlier, Tuyau generates different types depending on whether @tuyau/superjson is installed.

Without SuperJSON, Tuyau serializes data at the type level. For example, if your API returns a `Date`, the inferred return type in your frontend will be `string`, not `Date`. Thanks to TypeScript wizardry, Tuyau ensures type consistency when data pass over the wire.

However, when using SuperJSON, things change. If your API returns a `Date`, your frontend will receive an actual `Date` at runtime, meaning there is no need for additional type conversion. This is why Tuyau generates different types depending on whether SuperJSON is enabled, requiring you to run `node ace generate:tuyau` after installing `@tuyau/superjson`.

That said, this approach has some limitations. For example, if your API returns a Lucid model, the frontend will see it as the same type, which is incorrect. You need put extra care into ensuring your API returns the correct data types.

For reference, here are the types supported by SuperJSON:

| type        | supported by standard JSON? | supported by Superjson? |
| ----------- | --------------------------- | ----------------------- |
| `string`    | ✅                          | ✅                      |
| `number`    | ✅                          | ✅                      |
| `boolean`   | ✅                          | ✅                      |
| `null`      | ✅                          | ✅                      |
| `Array`     | ✅                          | ✅                      |
| `Object`    | ✅                          | ✅                      |
| `undefined` | ❌                          | ✅                      |
| `bigint`    | ❌                          | ✅                      |
| `Date`      | ❌                          | ✅                      |
| `RegExp`    | ❌                          | ✅                      |
| `Set`       | ❌                          | ✅                      |
| `Map`       | ❌                          | ✅                      |
| `Error`     | ❌                          | ✅                      |
| `URL`       | ❌                          | ✅                      |

If needed, you can add custom types using [SuperJSON Recipes](https://github.com/flightcontrolhq/superjson/blob/main/README.md#recipes).

