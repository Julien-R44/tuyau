---
'@tuyau/core': patch
---

Preserve tuple types in `ExtractBody`. Since 1.2.3, replacing `MultipartFile` with `File | Blob` also turned tuple fields such as `vine.tuple([vine.number(), vine.number()])` into plain arrays, so the client accepted arrays of any length and tools reading the registry lost the tuple. Tuples, optional and rest elements, and `readonly` are kept again.
