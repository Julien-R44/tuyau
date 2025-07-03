---
'@tuyau/client': patch
---

Before this commit, a network error during a Tuyau call without `unwrap()` would throw an error instead of returning it. This update ensures that such calls now return a `TuyauNetworkError` (not the standard `TuyauHttpError`). 

More details: https://github.com/Julien-R44/tuyau/issues/65
