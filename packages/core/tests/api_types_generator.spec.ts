import { test } from '@japa/runner'
import { cliui } from '@poppinss/cliui'

import { defineConfig } from '../src/define_config.js'
import { ApiTypesGenerator } from '../src/codegen/api_types_generator.js'
import { createController, createValidator, setupProject } from './helpers.js'

const logger = cliui().logger

test.group('Api Types Generator', (group) => {
  group.tap((t) => t.timeout(10_000))

  test('works fine', async ({ fs, assert }) => {
    const route = await createController({ name: 'UsersController', returnType: "{ foo: 'bar' }" })

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [route],
    })

    await apiTypesGenerator.generate()

    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).match()
  })

  test('extract validateUsing request', async ({ fs, assert }) => {
    const route = await createController({
      name: 'UsersController',
      returnType: "{ foo: 'bar' }",
      validator: await createValidator({
        name: 'getUsersValidator',
        schema: `
          limit: vine.number(),
          page: vine.number().optional(),
        `,
      }),
    })

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [route],
    })

    await apiTypesGenerator.generate()

    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).match()
  })

  test('extract default exported schema from validator', async ({ fs, assert }) => {
    const route = await createController({
      name: 'UsersController',
      returnType: "{ foo: 'bar' }",
      validator: await createValidator({
        defaultExport: true,
        name: 'getUsersValidator',
        schema: `
          limit: vine.number(),
          page: vine.number().optional(),
        `,
      }),
    })

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [route],
    })

    await apiTypesGenerator.generate()

    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).match()
  })

  test('also works with validators defined and exported from the same file', async ({
    fs,
    assert,
  }) => {
    await fs.create(
      `app/controllers/get_users_controller.ts`,
      `
      import vine from '@vinejs/vine'

      export const getUsersValidator = vine.compile(
        vine.object({
          limit: vine.number(),
          page: vine.number().optional(),
        })
      )

      export default class GetUsersController {
        public async index() {
          await request.validateUsing(getUsersValidator)
          return { foo: 'bar' }
        }
      }
      `,
    )

    const route = {
      pattern: '/get_users',
      methods: ['GET'],
      handler: {
        reference: '#controllers/get_users_controller.index',
        handle: () => {},
      },
      domain: 'root',
    } as any

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [route],
    })

    await apiTypesGenerator.generate()

    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).match()
  })

  test('warning if schema is not exported from the controller file', async ({ fs, assert }) => {
    await fs.create(
      `app/controllers/get_users_controller.ts`,
      `
      import vine from '@vinejs/vine'

      const getUsersValidator = vine.compile(
        vine.object({
          limit: vine.number(),
          page: vine.number().optional(),
        })
      )

      export default class GetUsersController {
        public async index() {
          await request.validateUsing(getUsersValidator)
          return { foo: 'bar' }
        }
      }
      `,
    )

    const route = {
      pattern: '/get_users',
      methods: ['GET'],
      handler: {
        reference: '#controllers/get_users_controller.index',
        handle: () => {},
      },
      domain: 'root',
    } as any

    const raw = cliui({ mode: 'raw' })
    const apiTypesGenerator = new ApiTypesGenerator({
      logger: raw.logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [route],
    })

    await apiTypesGenerator.generate()

    const logs = raw.logger.getLogs()
    const warning = logs.find((log) =>
      log.message.includes('Unable to find the schema file for getUsersValidator'),
    )

    assert.exists(warning)
  })

  test('warning when imported schema implementation is not found', async ({ fs, assert }) => {
    const route = await createController({
      name: 'UsersController',
      returnType: "{ foo: 'bar' }",
      validator: {
        name: 'getUsersValidator',
        path: 'app/validators/get_users_validator.ts',
      },
    })

    const raw = cliui({ mode: 'raw' })
    const apiTypesGenerator = new ApiTypesGenerator({
      logger: raw.logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [route],
    })

    await apiTypesGenerator.generate()

    const logs = raw.logger.getLogs()
    const warning = logs.find((log) =>
      log.message.includes('Unable to find the schema file for getUsersValidator'),
    )
    assert.exists(warning)
  })

  test('should use unknown in route name array if type is not found', async ({ fs, assert }) => {
    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [
        {
          pattern: '/users',
          methods: ['GET'],
          name: 'users',
          handler: { reference: '#controllers/users_controller.index', handle: () => {} },
          domain: 'root',
        },
      ] as any,
    })

    await apiTypesGenerator.generate()

    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).match()
  })
})

test.group('Api Types Generator | Filters', () => {
  test('filter definitions using codegen.only function', async ({ fs, assert }) => {
    const routeA = await createController({ name: 'UsersController', returnType: "{ foo: 'bar' }" })
    const routeB = await createController({ name: 'PostsController', returnType: "{ foo: 'bar' }" })

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: defineConfig({
        codegen: { definitions: { only: (route) => route.pattern === '/users' } },
      }),
      appRoot: fs.baseUrl,
      routes: [routeA, routeB],
    })

    await apiTypesGenerator.generate()
    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).match()
  })

  test('filter definitions using codegen.except function', async ({ fs, assert }) => {
    const routeA = await createController({ name: 'UsersController', returnType: "{ foo: 'bar' }" })
    const routeB = await createController({ name: 'PostsController', returnType: "{ foo: 'bar' }" })

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: defineConfig({
        codegen: { definitions: { except: (route) => route.pattern === '/users' } },
      }),
      appRoot: fs.baseUrl,
      routes: [routeA, routeB],
    })

    await apiTypesGenerator.generate()
    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).match()
  })

  test('filter definitions using codegen.only array', async ({ fs, assert }) => {
    const routeA = await createController({ name: 'UsersController', returnType: "{ foo: 'bar' }" })
    const routeB = await createController({ name: 'PostsController', returnType: "{ foo: 'bar' }" })

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: defineConfig({
        codegen: { definitions: { only: [/users/] } },
      }),
      appRoot: fs.baseUrl,
      routes: [routeA, routeB],
    })

    await apiTypesGenerator.generate()
    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).match()
  })

  test('filter definitions using codegen.except array', async ({ fs, assert }) => {
    const routeA = await createController({ name: 'UsersController', returnType: "{ foo: 'bar' }" })
    const routeB = await createController({ name: 'PostsController', returnType: "{ foo: 'bar' }" })

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: defineConfig({
        codegen: { definitions: { except: [/users/] } },
      }),
      appRoot: fs.baseUrl,
      routes: [routeA, routeB],
    })

    await apiTypesGenerator.generate()
    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).match()
  })

  test('add inertia types only when tuyau/inertia is installed', async ({ fs, assert }) => {
    const route = await createController({ name: 'UsersController', returnType: "{ foo: 'bar' }" })

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject({
        packageJson: { dependencies: { '@tuyau/inertia': 'latest' } },
      }),
      config: defineConfig({ codegen: { definitions: { only: [/users/] } } }),
      appRoot: fs.baseUrl,
      routes: [route],
    })

    await apiTypesGenerator.generate()

    assert.fileContains('./.adonisjs/api.ts', '@tuyau/inertia/types')
  })
})
