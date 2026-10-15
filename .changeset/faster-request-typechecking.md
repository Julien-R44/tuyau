---
'@tuyau/core': patch
---

Reduce request type-checking time for large route registries and avoid TS2590 errors during generic inference.

Use `unknown` for empty argument branches while preserving checks for required fields, unrelated optional arguments, and nullish raw arguments. Runtime behavior is unchanged.
