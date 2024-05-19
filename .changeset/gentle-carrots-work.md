---
"@tuyau/core": patch
---

When a vine validator referenced in a `validateUsing` was imported with a `default export`, then the validator was not found. This is now fixed.
