# @tuyau/utils

## 0.0.8

### Patch Changes

- 3c43a07: Remove Simplify'ication when using SuperJson

  Otherwise it will break some typing, for example Luxon's DateTime will be transformed into a weird object instead of a DateTime instance.

## 0.0.7

### Patch Changes

- dc0e6bf: `node ace tuyau:generate` will now generate different typing when `@tuyau/superjson` is installed. Because, when `@tuyau/superjson` is installed, the inferred type of returned data should not be "type-serialized" since this is the whole point of superjson

## 0.0.5

### Patch Changes

- 7678e36: Automatic 422 response if the request input is validated using `validateUsing`.
