---
'@tuyau/core': patch
---

Generate compact route tokens as `[type, val, end?]`, omitting empty suffixes. The client decodes them once during initialization and continues to accept object tokens from older registries, with or without `old`.

If the generator and client are installed separately, update both before consuming a newly generated registry. Older clients cannot read tuple tokens.
