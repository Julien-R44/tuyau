---
'@tuyau/client': minor
---

Fix for a bug when using the `$url` function on routes with multiple parameters that were not defined with snake_case on the AdonisJS side.

For example:

```ts
router.get('/posts/:postId/comments/:commentId', '...').as('posts.comments');
tuyau.$url('posts.comments', { postId: 1, commentId: 2 });
```

This code would throw an error stating that the parameters were not defined
