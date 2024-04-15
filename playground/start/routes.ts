/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')
const InertiaController = () => import('#controllers/inertia_controller')

router.get('/users', [UsersController, 'index'])
router.get('/simple-text', [UsersController, 'simpleText'])
router.post('/file-upload', [UsersController, 'fileUpload'])

router.get('/', [InertiaController, 'index'])
router.get('/backoffice', [InertiaController, 'backoffice'])
