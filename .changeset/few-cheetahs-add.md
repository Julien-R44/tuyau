---
"@tuyau/inertia": patch
---

This PR introduces a new `@tuyau/inertia` package. Goal is to add some components to provide greater type-safety on AdonisJS x InertiaJS apps.

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
    <Link route="posts.edit" params={{ id: 2 }}>Home</Link>
  )
}
```

`Link` component has the same props as the InertiaJS `Link`, except for the `href` and `method` props, which are not needed anymore and replaced by the `route` and `params` props.
