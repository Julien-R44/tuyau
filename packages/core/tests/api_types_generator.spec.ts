import { cliui } from '@poppinss/cliui'
import { Project, QuoteKind } from 'ts-morph'
import { getActiveTest, test } from '@japa/runner'

import { ApiTypesGenerator } from '../src/codegen/api_types_generator.js'

const logger = cliui().logger

async function setupProject() {
  const test = getActiveTest()
  if (!test) {
    throw new Error('Missing active test')
  }

  await test.context.fs.createJson('tsconfig.json', { include: ['**/*'] })
  await test.context.fs.createJson('package.json', {
    type: 'module',
    imports: { '#controllers/*': './app/controllers/*.js' },
  })

  return new Project({
    tsConfigFilePath: new URL('./tsconfig.json', test.context.fs.baseUrl).pathname,
    manipulationSettings: { quoteKind: QuoteKind.Single },
  })
}

test.group('Api Types Generator', () => {
  test('works fine', async ({ fs, assert }) => {
    await fs.create(
      'app/controllers/users_controller.ts',
      `export default class UsersController {
        public async index() {
          return { foo: 'bar' }
        }
      }`,
    )

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [
        {
          pattern: '/users',
          methods: ['GET'],
          handler: { reference: '#controllers/users_controller.index', handle: () => {} },
          domain: 'root',
        },
      ] as any,
    })

    await apiTypesGenerator.generate()

    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).matchInline(`
      "import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
      import type { InferInput } from '@vinejs/vine/types'

      type UsersGet = {
        request: unknown
        response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['index']>
      }
      interface AdonisApi {
        'users': {
          '$url': {
          };
          '$get': UsersGet;
        };
      }
      const routes = [
      ] as const;
      export const api = {
        routes,
        definition: {} as AdonisApi
      }
      "
    `)
  })

  test('extract validateUsing request', async ({ fs, assert }) => {
    await fs.create(
      'app/controllers/validator.ts',
      `
      import vine from '@vinejs/vine'

      export const getUsersValidator = vine.compile(
        vine.object({
          limit: vine.number(),
          page: vine.number().optional(),
        }),
      )`,
    )

    await fs.create(
      'app/controllers/users_controller.ts',
      `
      import { getUsersValidator } from './validator.ts'

      export default class UsersController {
        public async index({ request }) {
          await request.validateUsing(getUsersValidator)
          return { foo: 'bar' }
        }
      }`,
    )

    const apiTypesGenerator = new ApiTypesGenerator({
      logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [
        {
          pattern: '/users',
          methods: ['GET'],
          handler: { reference: '#controllers/users_controller.index', handle: () => {} },
          domain: 'root',
        },
      ] as any,
    })

    await apiTypesGenerator.generate()

    const file = await fs.contents('./.adonisjs/api.ts')
    assert.snapshot(file).matchInline(`
      "import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
      import type { InferInput } from '@vinejs/vine/types'

      type UsersGet = {
        request: MakeTuyauRequest<InferInput<typeof import('../app/controllers/validator.ts')['getUsersValidator']>>
        response: MakeTuyauResponse<import('../app/controllers/users_controller.ts').default['index']>
      }
      interface AdonisApi {
        'users': {
          '$url': {
          };
          '$get': UsersGet;
        };
      }
      const routes = [
      ] as const;
      export const api = {
        routes,
        definition: {} as AdonisApi
      }
      "
    `)
  })

  test('warning when schema implementation is not found', async ({ fs, assert }) => {
    await fs.create(
      'app/controllers/users_controller.ts',
      `
      export default class UsersController {
        public async index() {
          await request.validateUsing(getUsersValidator)
        }
      }`,
    )

    const raw = cliui({ mode: 'raw' })
    const apiTypesGenerator = new ApiTypesGenerator({
      logger: raw.logger,
      project: await setupProject(),
      config: {},
      appRoot: fs.baseUrl,
      routes: [
        {
          pattern: '/users',
          methods: ['GET'],
          handler: { reference: '#controllers/users_controller.index', handle: () => {} },
          domain: 'root',
        },
      ] as any,
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
    assert.snapshot(file).matchInline(`
      "import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
      import type { InferInput } from '@vinejs/vine/types'

      interface AdonisApi {
      }
      const routes = [
        {
          params: [],
          name: 'users',
          path: '/users',
          method: [\\"GET\\"],
          types: {} as unknown,
        },
      ] as const;
      export const api = {
        routes,
        definition: {} as AdonisApi
      }
      "
    `)
  })
})
