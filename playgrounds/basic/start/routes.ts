/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router.on('/').renderInertia('home', {}).as('home')
router.on('/posts-page').renderInertia('posts', {}).as('posts.page')
router.on('/products-page').renderInertia('products', {}).as('products.page')
router.on('/users-page').renderInertia('users', {}).as('users.page')

router
  .group(() => {
    router.get('signup', [controllers.Accounts, 'create'])
    router.post('signup', [controllers.Accounts, 'store'])
    router.post('users/profile-picture', [controllers.Accounts, 'uploadProfilePicture'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

// Users API
router.get('/users', [controllers.Users, 'list'])
router.get('/users/:id', [controllers.Users, 'show'])
router.post('/users', [controllers.Users, 'store'])
router.put('/users/:id', [controllers.Users, 'update'])
router.delete('/users/:id', [controllers.Users, 'delete']).where('id', {
  match: /^\d+$/,
})

// Posts API (for infinite query testing)
router
  .group(() => {
    router.get('/', [controllers.Posts, 'list'])
    router.get('/:id', [controllers.Posts, 'show'])
    router.post('/', [controllers.Posts, 'store'])
    router.put('/:id', [controllers.Posts, 'update'])
    router.delete('/:id', [controllers.Posts, 'delete'])
  })
  .prefix('/posts')

// Products API (for query params testing)
router
  .group(() => {
    router.get('/search', [controllers.Products, 'search'])
    router.get('/categories', [controllers.Products, 'categories'])
    router.get('/category/:category', [controllers.Products, 'byCategory'])
    router.get('/:id', [controllers.Products, 'show'])
    router.post('/', [controllers.Products, 'store'])
    router.delete('/:id', [controllers.Products, 'delete'])
  })
  .prefix('/products')

router
  .group(() => {
    router.get('/posts-api', [controllers.Posts, 'list']).as('blog.posts.api')
  })
  .domain('blog')
