/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const PostsController = () => import('#controllers/posts_controller')
const UsersController = () => import('#controllers/users_controller')
const InertiaController = () => import('#controllers/inertia_controller')
const CommentsController = () => import('#controllers/comments_controller')

router.get('/users', [UsersController, 'index']).as('users.index')
router.get('/simple-text', [UsersController, 'simpleText']).as('simpleText')
router.post('/file-upload', [UsersController, 'fileUpload']).as('fileUpload')

router.get('/', [InertiaController, 'index']).as('home')
router.get('/backoffice', [InertiaController, 'backoffice']).as('backoffice')
router.resource('posts', PostsController).as('posts')
router.resource('posts.comments', CommentsController).as('posts.comments')
router.delete('/posts/:postId/comments/:id', [CommentsController, 'destroy']).as('test-random')

router.get('/test', () => {
  return 'foo'
})
