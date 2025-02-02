---
'@tuyau/core': patch
'@tuyau/utils': patch
---

`node ace tuyau:generate` will now generate different typing when `@tuyau/superjson` is installed. Because, when `@tuyau/superjson` is installed, the inferred type of returned data should not be "type-serialized" since this is the whole point of superjson
