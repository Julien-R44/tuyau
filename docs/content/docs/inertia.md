---
summary: Inertia helpers for AdonisJS, Ziggy-like API for you frontend application.
---

# Inertia package

Tuyau also provides a set of helpers for Inertia projects. The package is called `@tuyau/inertia`. First, make sure to have generated the API definition in your AdonisJS project using `@tuyau/core` and also have configured the client in your frontend project using `@tuyau/client`.

Then, you can install the package in your frontend project :

```bash
pnpm add @tuyau/inertia
```
## React usage

To use the Inertia helpers in your React x Inertia project, you must wrap your app with the `TuyauProvider` component :

```tsx
// inertia/app/app.tsx
import { TuyauProvider } from '@tuyau/inertia/react'
import { tuyau } from './tuyau'

createInertiaApp({
  // ...

  setup({ el, App, props }) {
    hydrateRoot(
      el,
      <>
        <TuyauProvider client={tuyau}>
          <App {...props} />
        </TuyauProvider>
      </>
    )
  },
})
```

As you can see, you must pass an instance of the Tuyau client to the `TuyauProvider` component. Also, if you are using SSR, make sure to also wrap your app with the `TuyauProvider` component in your `inertia/app/ssr.tsx` file.

### Link

The `Link` component is a wrapper around the Inertia `Link` component with some additional typesafety. Tuyau `Link` component will accept the same props as the Inertia `Link` component except for the `href` and `method` props. They are replaced by the `route` and `params` props.

```tsx
import { Link } from '@tuyau/inertia/react'

<Link route="users.posts.show" params={{ id: 1, postId: 2 }}>Go to post</Link>
```

### Manual visits

The `useRouter` hook is useful to manually visit a route in your application. It returns an object with a `visit` method that you can use to visit a route.

```tsx
import { useRouter } from '@tuyau/inertia/react'

const router = useRouter()

router.visit('users.posts.show', { id: 1, postId: 2 })
```


## Vue usage

To use the Inertia helpers in your Vue x Inertia project, you must install the Tuyau plugin :

```ts
// inertia/app/app.ts

import { TuyauPlugin } from '@tuyau/inertia/vue'
import { tuyau } from './tuyau'

createInertiaApp({
  // ...

  setup({ el, App, props, plugin }) {
    createSSRApp({ render: () => h(App, props) })
      .use(plugin)
      .use(TuyauPlugin, { client: tuyau })
      .mount(el)
  },
})
```

As you can see, you must pass an instance of the Tuyau client to the `TuyauPlugin` plugin. Also, if you are using SSR, make sure to also install the `TuyauPlugin` plugin in your `inertia/app/ssr.ts` file.

### Link

The `Link` component is a wrapper around the Inertia `Link` component with some additional typesafety. Tuyau `Link` component will accept the same props as the Inertia `Link` component except for the `href` and `method` props. They are replaced by the `route` and `params` props.

```vue
<script setup lang="ts">
import { Link } from '@tuyau/inertia/vue'
</script>

<template>
  <Link route="users.posts.show" :params="{ id: 1, postId: 2 }">Go to post</Link>
</template>
```

### Manual visits

The `useRouter` hook is useful to manually visit a route in your application. It returns an object with a `visit` method that you can use to visit a route.


```vue
<script setup lang="ts">
import { useRouter } from '@tuyau/inertia/vue'

const router = useRouter()
</script>

<template>
  <button @click="router.visit('users.posts.show', { id: 1, postId: 2 })">Go to post</button>
</template>
```