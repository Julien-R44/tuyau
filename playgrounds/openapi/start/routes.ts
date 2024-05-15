/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const MiscController = () => import('#controllers/misc_controller')
const UsersController = () => import('#controllers/users_controller')

router
  .resource('users', UsersController)
  .apiOnly()
  .detail({
    global: { tags: ['users'] },
    actions: {
      destroy: { description: 'Delete a user' },
      index: { description: 'List all users' },
      show: { description: 'Show a user' },
      store: { description: 'Create a user' },
      update: { description: 'Update a user' },
    },
  })

router.get('/random', [MiscController, 'index']).detail({
  description: 'Get a random thing',
  tags: ['misc'],
})
