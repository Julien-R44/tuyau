---
"@tuyau/client": patch
---

Add $current helper to check the current route. You can use the `$current` method to get or check the current route :

```ts
// Current window location is http://localhost:3000/users/1/posts/2, route name is users.posts.show
tuyau.$current() // users.posts
tuyau.$current('users.posts.show') // true
tuyau.$current('users.*') // true
tuyau.$current('users.edit') // false
```

You can also specify route parameters or query parameters to check :

```ts
tuyau.$current('users.posts.show', { params: { id: 1, postId: 2 } }) // true
tuyau.$current('users.posts.show', { params: { id: 12 } }) // false
tuyau.$current('users.posts.show', { query: { page: 1 } }) // false
```
