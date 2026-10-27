---
'@tuyau/core': minor
---

Export registry-local `Route` and `Path` type helpers from each generated registry. Add `typeAugmentation: false` to disable the global `UserRegistry` augmentation for secondary registries. The default remains `true` for compatibility with existing core helpers and AdonisJS Inertia.

Support multiple `generateRegistry` hooks with independent route filters, and make global and sticky regex filters repeatable across scanning and output generation.
