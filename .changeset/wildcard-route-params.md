---
'@tuyau/core': minor
---

Support wildcard `*` route params in generated types

Wildcard route parameters (e.g. `/downloads/*`) are now included in the generated params type as `'*': ParamValue[]`, matching AdonisJS's runtime behavior where the wildcard captures all remaining URL segments as an array.

Previously, the codegen only extracted named `:param` tokens and ignored wildcard tokens, which meant `urlFor()` and `request()` calls with `*` params would fail type checking despite working at runtime.

```ts
// AdonisJS route
router.get('/docs/:category/*', [DocsController, 'show']).as('docs.show')

// Generated params type now includes '*'
// params: { category: ParamValue; '*': ParamValue[] }

// Client usage
const tuyau = createTuyau({ baseUrl: 'http://localhost:3333', registry })

tuyau.request('docs.show', {
  params: { 'category': 'guides', '*': ['sql', 'orm', 'query-builder'] },
})

tuyau.urlFor.get('docs.show', {
  'category': 'guides',
  '*': ['sql', 'orm', 'query-builder'],
})
```
