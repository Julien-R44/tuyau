---
'@tuyau/core': patch
---

Fix shallow file detection in request body. `#hasFile` now recursively checks nested objects and arrays (up to 5 levels deep) to properly detect files and switch to multipart/form-data.
