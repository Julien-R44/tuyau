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

router.resource('users', UsersController)

router.get('/', [InertiaController, 'index'])
router.get('/backoffice', [InertiaController, 'backoffice'])
