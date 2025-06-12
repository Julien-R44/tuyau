---
'@tuyau/utils': patch
---

Remove Simplify'ication when using SuperJson

Otherwise it will break some typing, for example Luxon's DateTime will be transformed into a weird object instead of a DateTime instance.
