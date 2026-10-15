---
'@tuyau/query-core': patch
'@tuyau/react-query': patch
'@tuyau/vue-query': patch
'@tuyau/svelte-query': patch
---

Apply global HTTP options, including `timeout`, to queries, infinite queries, and mutations. Local `tuyau` options override global options. Ky retries remain disabled so TanStack Query controls retries.
