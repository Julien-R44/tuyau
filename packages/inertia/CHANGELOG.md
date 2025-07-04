# @tuyau/inertia

## 0.0.14

### Patch Changes

- @tuyau/client@0.2.9

## 0.0.13

### Patch Changes

- Updated dependencies [c738d34]
  - @tuyau/client@0.2.8

## 0.0.12

### Patch Changes

- Updated dependencies [d7fc509]
- Updated dependencies [3266a06]
- Updated dependencies [9d24bbb]
  - @tuyau/client@0.2.7

## 0.0.11

### Patch Changes

- 694ffb4: Add `useRouter` hook/composable that expose a typesafe `visit` method to manually visit a route.

  ```tsx
  import { useRouter } from '@tuyau/inertia/vue'

  const router = useRouter()

  router.visit(
    {
      name: 'users.posts.show',
      params: { id: 1, postId: 2 },
    },
    { preserveState: true },
  )
  ```

  Also available for React.

- Updated dependencies [ad866b3]
  - @tuyau/client@0.2.6

## 0.0.10

### Patch Changes

- Updated dependencies [faa2ba6]
  - @tuyau/client@0.2.5

## 0.0.9

### Patch Changes

- 1c7c8ed: Types seem to not have been published on the latest version.
- Updated dependencies [cb64666]
  - @tuyau/client@0.2.3

## 0.0.8

### Patch Changes

- 6684f44: Support InertiaJS 2

## 0.0.7

### Patch Changes

- Updated dependencies [e40e327]
- Updated dependencies [18aacee]
  - @tuyau/client@0.2.2

## 0.0.6

### Patch Changes

- Updated dependencies [4774ad4]
  - @tuyau/client@0.2.1

## 0.0.5

### Patch Changes

- Updated dependencies [ab51d40]
  - @tuyau/client@0.2.0

## 0.0.4

### Patch Changes

- Updated dependencies [76569fa]
  - @tuyau/client@0.1.3

## 0.0.3

### Patch Changes

- 8c77893: Link for Vue and React did not work when used with params. See issue #10
  This is now fixed.
- a2460d0: Incorrect typing for vue plugin

## 0.0.2

### Patch Changes

- 844d7a9: Fix #6

## 0.0.1

### Patch Changes

- 2da60a7: This PR introduces a new `@tuyau/inertia` package. Goal is to add some components to provide greater type-safety on AdonisJS x InertiaJS apps.

  With this PR, we're only adding the `Link` component, for React and Vue, which is a wrapper of the InertiaJS `Link` component, but type-safe.

  Usage is super easy : just import `Link` from `@tuyau/inertia` rather than `@inertiajs/inertia-react` or `@inertiajs/inertia-vue`.

  ```vue
  <script setup lang="ts">
  import { Link } from '@tuyau/inertia'
  </script>

  <template>
    <Link route="posts.edit" :params="{ id: 2 }">Home</Link>
  </template>
  ```

  Same for React :

  ```tsx
  import { Link } from '@tuyau/inertia'

  export function MyComponent() {
    return (
      <Link route="posts.edit" params={{ id: 2 }}>
        Home
      </Link>
    )
  }
  ```

  `Link` component has the same props as the InertiaJS `Link`, except for the `href` and `method` props, which are not needed anymore and replaced by the `route` and `params` props.

- Updated dependencies [793a775]
  - @tuyau/client@0.1.2
