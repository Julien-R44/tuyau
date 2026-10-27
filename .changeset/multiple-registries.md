---
'@tuyau/core': patch
---

Allow `generateRegistry` to be registered several times, each with its own `output` and `routes` filter. The assembler's routes scanner holds a single filter, so a second registry overwrote the first one's filter and every output got the same routes.
