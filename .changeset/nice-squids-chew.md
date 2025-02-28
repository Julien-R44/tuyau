---
'@tuyau/client': patch
---

Fix when returning a 2xx status code ( that is not 201 ), the response type of `unwrap` was `unknown`. See #45
