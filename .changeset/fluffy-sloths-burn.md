---
'@tuyau/client': patch
---

Added a basic plugin system for the client.

```ts
import type { TuyauPlugin } from '@tuyau/client'

export function myPlugin(): TuyauPlugin {
  return ({ options }) => {
    // Do something with the options object. You can mutate them
    // as you wish.
  }
}

export const tuyau = createTuyau({
  api,
  baseUrl: `http://localhost:3333`,
  plugins: [myPlugin()],
})
```
