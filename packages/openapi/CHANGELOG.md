# @tuyau/openapi

## 1.0.2

### Patch Changes

- 8fd28ad: Update peer dependency version
  - @tuyau/core@0.3.2

## 1.0.1

### Patch Changes

- 58f94ad: Fixed multi-level group route `.openapi()` parsing.
- 8188e49: Fix multi-level group .openapi(). See https://github.com/Julien-R44/tuyau/pull/19
- Updated dependencies [b515810]
- Updated dependencies [7678e36]
  - @tuyau/core@0.2.2

## 1.0.0

### Patch Changes

- Updated dependencies [df82585]
  - @tuyau/core@0.2.0

## 0.1.2

### Patch Changes

- 649adc4: First experimental version of @tuyau/openapi.

  ## OpenAPI Spec generation

  The concept is quite simple: we generate an openapi spec from the @tuyau/core codegen. This generation is done using ts-morph and the typescript compiler: we analyse and extract the types of requests/replies, and generate the OpenAPI spec based on this. Of course, there are limitations compared to manually written specs. I'll go into more detail about the limitations in the documentation coming soon.
  That said, although there are limitations, I think that in many cases it can do the job just fine

  Also, to bypass some of the limitations of the automatic generation, you can add details to the spec using the `detail` macro available on the routes :

  ```ts
  router
    .group(() => {
      router.get('/random', [MiscController, 'index']).detail({ description: 'Get a random thing' })
      router
        .get('/random/:id', [MiscController, 'show'])
        .detail({ description: 'Get a random thing by id' })
    })
    .prefix('/misc')
    .detail({ tags: ['misc'] })
  ```

  These `details` will be merged and added to the auto-generated OpenAPI spec.

  ## OpenAPI Viewer

  In addition to auto-generation, the package will automatically expose a `/docs` route on which the openapi spec is served, via either Scalar or Swagger-UI. Everything is configurable.

  ![image](https://github.com/Julien-Sponsors/tuyau/assets/8337858/95840899-cbe6-42bf-983e-b968d1d17fe6)

  ***

  This version is very experimental. There are a few things that don't work 100% yet: some types are badly generated. But this is a pretty decent first version. Also, I will detail how to install and use it in the coming documentation

- Updated dependencies [dae1f80]
  - @tuyau/core@0.1.4
