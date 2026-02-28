---
'@tuyau/core': minor
---

Add `has()` and `current()` methods for route introspection

- `tuyau.has('users.show')` — checks if a route name exists in the registry
- `tuyau.current()` — returns the current route name based on `window.location`
- `tuyau.current('users.show')` — returns `true` if the current URL matches that route
- `tuyau.current('users.*')` — supports `*` wildcards to match multiple routes
- `tuyau.current('users.show', { params: { id: 42 }, query: { foo: 'bar' } })` — additionally checks params and query
