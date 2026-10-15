---
'@tuyau/core': patch
---

Fix generated registry typing for open-record validators such as `vine.record(vine.string())`. Treat inferred non-object query types as empty query parameters instead of invalidating the registry.
