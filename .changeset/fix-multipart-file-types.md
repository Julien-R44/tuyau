---
'@tuyau/core': patch
---

Replace `MultipartFile` with `File | Blob` in client-side body types.

When using `vine.file()` in validators, the generated types previously exposed `MultipartFile` (a server-side type) to the client, forcing users to cast it to `File` or `Blob` when handling file uploads on the client. With this change,`ExtractBody` now automatically replaces `MultipartFile` with `File | Blob`.
