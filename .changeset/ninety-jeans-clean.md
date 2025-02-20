---
'@tuyau/inertia': patch
---

Add `useRouter` hook/composable that expose a typesafe `visit` method to manually visit a route. 

```tsx
import { useRouter } from '@tuyau/inertia/vue'

const router = useRouter()

router.visit({
  name: 'users.posts.show',
  params: { id: 1, postId: 2 }
}, { preserveState: true })
```

Also available for React.
