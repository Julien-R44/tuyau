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

router
  .group(() => {
    router.get('signup', [controllers.Accounts, 'create'])
    router.post('signup', [controllers.Accounts, 'store'])
    router.post('users/profile-picture', [controllers.Accounts, 'uploadProfilePicture'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])

    router.get('/users/:id', [controllers.Session, 'create']).as('users.show')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

router.get('/users', [controllers.Users, 'list'])
router.post('/users', [controllers.Users, 'store'])
router.delete('/users/:id', [controllers.Users, 'delete'])
