/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const TodosController = () => import('#controllers/todos_controller')
const PostsController = () => import('#controllers/posts_controller')
const UsersController = () => import('#controllers/users_controller')
const InertiaController = () => import('#controllers/inertia_controller')
const CommentsController = () => import('#controllers/comments_controller')

router.get('/users', [UsersController, 'index']).as('users.index')
router.get('/simple-text', [UsersController, 'simpleText']).as('simpleText')
router.post('/file-upload', [UsersController, 'fileUpload']).as('fileUpload')

router.get('/', [InertiaController, 'index']).as('home')
router.get('/backoffice', [InertiaController, 'backoffice']).as('backoffice')

router.get('/posts', [PostsController, 'indexPage']).as('posts.page')
router.get('/api/posts', [PostsController, 'index']).as('posts.api')
router.get('/posts/create', [PostsController, 'create']).as('posts.create')
router.post('/posts', [PostsController, 'store']).as('posts.store')
router.get('/posts/:id', [PostsController, 'show']).as('posts.show')
router.get('/posts/:id/edit', [PostsController, 'edit']).as('posts.edit')
router.put('/posts/:id', [PostsController, 'update']).as('posts.update')
router.delete('/posts/:id', [PostsController, 'destroy']).as('posts.destroy')

router.resource('posts.comments', CommentsController).as('posts.comments')

router.get('/test', () => 'foo')

router
  .group(() => {
    router.get('/todos', [TodosController, 'index'])
    router.post('/todos', [TodosController, 'store'])
    router.delete('/todos/:id', [TodosController, 'destroy'])
  })
  .prefix('api')
