import { test } from '@japa/runner'
import type { ScannedRoute, RoutesListItem } from '@adonisjs/assembler/types'

import { RegistryGenerator } from '../src/backend/registry_generator.ts'

function makeRoute(overrides: Partial<ScannedRoute> & { name: string }): ScannedRoute {
  return {
    methods: ['GET'],
    domain: 'root',
    pattern: '/test',
    tokens: [{ old: '/test', type: 0, val: 'test', end: '' }],
    ...overrides,
  }
}

function makeRoutesListItem(name: string): RoutesListItem {
  return { name, pattern: '/test', methods: ['GET'], handler: { type: 'closure' } } as any
}

test.group('generateTypesContent | validation error injection', () => {
  test('adds 422 error type for routes with a validator (default)', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.store',
        methods: ['POST'],
        pattern: '/users',
        request: { type: 'InferInput<typeof createUserValidator>', imports: [] },
        response: { type: 'unknown', imports: [] },
      }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateTypesContent(routes)

    assert.include(content, '{ status: 422; response: { errors: SimpleError[] } }')
  })

  test('does not add 422 for routes without a validator', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'home',
        methods: ['GET'],
        pattern: '/',
      }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateTypesContent(routes)

    assert.notInclude(content, '422')
    assert.include(content, 'errorResponse: unknown')
  })

  test('unions 422 with existing error response types', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.store',
        methods: ['POST'],
        pattern: '/users',
        request: { type: 'InferInput<typeof createUserValidator>', imports: [] },
        response: { type: "ReturnType<UsersController['store']>", imports: [] },
      }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateTypesContent(routes)

    assert.include(
      content,
      "ExtractErrorResponse<Awaited<ReturnType<UsersController['store']>>> | { status: 422; response: { errors: SimpleError[] } }",
    )
  })

  test('supports custom validationErrorType string', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.store',
        methods: ['POST'],
        pattern: '/users',
        request: { type: 'InferInput<typeof createUserValidator>', imports: [] },
        response: { type: 'unknown', imports: [] },
      }),
    ]

    const generator = new RegistryGenerator({ validationErrorType: 'MyCustomError' })
    const content = generator.generateTypesContent(routes)

    assert.include(content, '{ status: 422; response: MyCustomError }')
    assert.notInclude(content, 'SimpleError')
  })

  test('disables 422 injection when validationErrorType is false', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.store',
        methods: ['POST'],
        pattern: '/users',
        request: { type: 'InferInput<typeof createUserValidator>', imports: [] },
        response: { type: 'unknown', imports: [] },
      }),
    ]

    const generator = new RegistryGenerator({ validationErrorType: false })
    const content = generator.generateTypesContent(routes)

    assert.notInclude(content, '422')
    assert.include(content, 'errorResponse: unknown')
  })

  test('imports SimpleError from vine only when using default type', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.store',
        methods: ['POST'],
        pattern: '/users',
        request: { type: 'InferInput<typeof v>', imports: [] },
      }),
    ]

    const withDefault = new RegistryGenerator().generateTypesContent(routes)
    assert.match(withDefault, /import type \{.*SimpleError.*\} from '@vinejs\/vine\/types'/)

    const withCustom = new RegistryGenerator({
      validationErrorType: 'MyError',
    }).generateTypesContent(routes)
    assert.notMatch(withCustom, /import type \{.*SimpleError.*\} from '@vinejs\/vine\/types'/)

    const withDisabled = new RegistryGenerator({ validationErrorType: false }).generateTypesContent(
      routes,
    )
    assert.notMatch(withDisabled, /import type \{.*SimpleError.*\} from '@vinejs\/vine\/types'/)
  })

  test('mixed routes: only validator routes get 422', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'home',
        methods: ['GET'],
        pattern: '/',
      }),
      makeRoute({
        name: 'users.store',
        methods: ['POST'],
        pattern: '/users',
        request: { type: 'InferInput<typeof v>', imports: [] },
      }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateTypesContent(routes)

    const homeSection = content.split("'users.store'")[0]
    const usersSection = content.split("'users.store'")[1]

    assert.notInclude(homeSection, '422')
    assert.include(usersSection, '{ status: 422; response: { errors: SimpleError[] } }')
  })
})

test.group('generateRuntimeContent', () => {
  test('generates runtime entry with methods, pattern, and tokens', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.index',
        methods: ['GET'],
        pattern: '/users',
        tokens: [{ old: '/users', type: 0, val: 'users', end: '' }],
      }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateRuntimeContent(routes)

    assert.include(content, "'users.index'")
    assert.include(content, '"GET"')
    assert.include(content, "pattern: '/users'")
    assert.include(content, "import type { AdonisEndpoint } from '@tuyau/core/types'")
    assert.include(content, 'as const satisfies Record<string, AdonisEndpoint>')
  })

  test('sanitizes tokens (removes matcher)', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.show',
        methods: ['GET'],
        pattern: '/users/:id',
        tokens: [
          { old: '/users/', type: 0, val: 'users', end: '' },
          { old: ':id', type: 1, val: 'id', end: '', matcher: /\d+/ } as any,
        ],
      }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateRuntimeContent(routes)

    assert.notInclude(content, 'matcher')
  })
})

test.group('generateTreeContent', () => {
  test('generates nested tree structure from dot-separated route names', ({ assert }) => {
    const routes = [
      makeRoute({ name: 'auth.login', pattern: '/auth/login', methods: ['POST'] }),
      makeRoute({ name: 'auth.register', pattern: '/auth/register', methods: ['POST'] }),
      makeRoute({ name: 'users.index', pattern: '/users', methods: ['GET'] }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateTreeContent(routes)

    assert.include(content, 'export interface ApiDefinition')
    assert.include(content, 'auth: {')
    assert.include(content, "login: typeof routes['auth.login']")
    assert.include(content, "register: typeof routes['auth.register']")
    assert.include(content, 'users: {')
    assert.include(content, "index: typeof routes['users.index']")
  })

  test('handles route that is both a leaf and prefix', ({ assert }) => {
    const routes = [
      makeRoute({ name: 'auth.login', pattern: '/auth/login', methods: ['POST'] }),
      makeRoute({ name: 'auth.login.render', pattern: '/auth/login', methods: ['GET'] }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateTreeContent(routes)

    assert.include(content, "login: typeof routes['auth.login'] & {")
    assert.include(content, "render: typeof routes['auth.login.render']")
  })
})

test.group('generate (full pipeline)', () => {
  test('returns runtime, types, and tree content', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.store',
        methods: ['POST'],
        pattern: '/users',
        request: { type: 'InferInput<typeof createUserValidator>', imports: [] },
        response: { type: "ReturnType<UsersController['store']>", imports: [] },
      }),
    ]

    const generator = new RegistryGenerator()
    const result = generator.generate(routes)

    assert.properties(result, ['runtime', 'types', 'tree'])
    assert.include(result.runtime, "'users.store'")
    assert.include(result.types, "'users.store'")
    assert.include(result.tree, "typeof routes['users.store']")
  })

  test('normalizes import paths in types content', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.store',
        methods: ['POST'],
        pattern: '/users',
        request: {
          type: "InferInput<typeof import('app/validators/user.ts').default>",
          imports: [],
        },
      }),
    ]

    const generator = new RegistryGenerator()
    const result = generator.generate(routes)

    assert.include(result.types, "import('#app/validators/user')")
    assert.notInclude(result.types, "import('app/")
  })

  test('handles wildcard route params', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'downloads.file',
        methods: ['GET'],
        pattern: '/downloads/*',
        tokens: [
          { old: '/downloads/*', type: 0, val: 'downloads', end: '' },
          { old: '/downloads/*', type: 2, val: 'path', end: '' },
        ],
      }),
    ]

    const generator = new RegistryGenerator()
    const result = generator.generate(routes)

    assert.include(result.types, "'*': ParamValue[]")
    assert.include(result.types, 'paramsTuple: [ParamValue]')
    assert.include(result.runtime, "'downloads.file'")
  })

  test('handles mixed dynamic and wildcard params', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'files.show',
        methods: ['GET'],
        pattern: '/files/:bucket/*',
        tokens: [
          { old: '/files/:bucket/*', type: 0, val: 'files', end: '' },
          { old: ':bucket', type: 1, val: 'bucket', end: '' },
          { old: '/files/:bucket/*', type: 2, val: 'path', end: '' },
        ],
      }),
    ]

    const generator = new RegistryGenerator()
    const result = generator.generate(routes)

    assert.include(result.types, 'bucket: ParamValue')
    assert.include(result.types, "'*': ParamValue[]")
    assert.include(result.types, 'paramsTuple: [ParamValue, ParamValue]')
  })

  test('handles dynamic route params', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.show',
        methods: ['GET'],
        pattern: '/users/:id',
        tokens: [
          { old: '/users/', type: 0, val: 'users', end: '' },
          { old: ':id', type: 1, val: 'id', end: '' },
        ],
      }),
    ]

    const generator = new RegistryGenerator()
    const result = generator.generate(routes)

    assert.include(result.types, 'id: ParamValue')
    assert.include(result.types, 'paramsTuple: [ParamValue]')
    assert.include(result.runtime, "'users.show'")
  })

  test('GET routes use ExtractQueryForGet instead of ExtractBody', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.index',
        methods: ['GET'],
        pattern: '/users',
        request: { type: 'InferInput<typeof listUsersValidator>', imports: [] },
      }),
    ]

    const generator = new RegistryGenerator()
    const result = generator.generate(routes)

    assert.include(result.types, 'body: {}')
    assert.include(result.types, 'ExtractQueryForGet<')
    assert.notInclude(result.types, 'ExtractBody<')
  })

  test('POST routes use ExtractBody and ExtractQuery', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.store',
        methods: ['POST'],
        pattern: '/users',
        request: { type: 'InferInput<typeof createUserValidator>', imports: [] },
      }),
    ]

    const generator = new RegistryGenerator()
    const result = generator.generate(routes)

    assert.include(result.types, 'ExtractBody<')
    assert.include(result.types, 'ExtractQuery<')
  })
})

test.group('filterRoute', () => {
  test('returns true when no filters are configured', ({ assert }) => {
    const generator = new RegistryGenerator()

    assert.isTrue(generator.filterRoute(makeRoutesListItem('users.index')))
  })

  test('only: includes routes matching a string pattern', ({ assert }) => {
    const generator = new RegistryGenerator({ routes: { only: ['users'] } })

    assert.isTrue(generator.filterRoute(makeRoutesListItem('users.index')))
    assert.isTrue(generator.filterRoute(makeRoutesListItem('users.store')))
    assert.isFalse(generator.filterRoute(makeRoutesListItem('auth.login')))
  })

  test('only: includes routes matching a regex pattern', ({ assert }) => {
    const generator = new RegistryGenerator({ routes: { only: [/^users\./] } })

    assert.isTrue(generator.filterRoute(makeRoutesListItem('users.index')))
    assert.isFalse(generator.filterRoute(makeRoutesListItem('admin.users.index')))
  })

  test('only: includes routes matching a function pattern', ({ assert }) => {
    const generator = new RegistryGenerator({
      routes: { only: [(name: string) => name.startsWith('api.')] },
    })

    assert.isTrue(generator.filterRoute(makeRoutesListItem('api.users')))
    assert.isFalse(generator.filterRoute(makeRoutesListItem('web.home')))
  })

  test('only: matches if any pattern matches', ({ assert }) => {
    const generator = new RegistryGenerator({
      routes: { only: ['users', /^auth\./] },
    })

    assert.isTrue(generator.filterRoute(makeRoutesListItem('users.index')))
    assert.isTrue(generator.filterRoute(makeRoutesListItem('auth.login')))
    assert.isFalse(generator.filterRoute(makeRoutesListItem('posts.index')))
  })

  test('except: excludes routes matching a string pattern', ({ assert }) => {
    const generator = new RegistryGenerator({ routes: { except: ['admin'] } })

    assert.isTrue(generator.filterRoute(makeRoutesListItem('users.index')))
    assert.isFalse(generator.filterRoute(makeRoutesListItem('admin.dashboard')))
  })

  test('except: excludes routes matching a regex pattern', ({ assert }) => {
    const generator = new RegistryGenerator({ routes: { except: [/^internal\./] } })

    assert.isTrue(generator.filterRoute(makeRoutesListItem('users.index')))
    assert.isFalse(generator.filterRoute(makeRoutesListItem('internal.health')))
  })

  test('except: excludes routes matching a function pattern', ({ assert }) => {
    const generator = new RegistryGenerator({
      routes: { except: [(name: string) => name.includes('debug')] },
    })

    assert.isTrue(generator.filterRoute(makeRoutesListItem('users.index')))
    assert.isFalse(generator.filterRoute(makeRoutesListItem('admin.debug.logs')))
  })

  test('throws when both only and except are provided', ({ assert }) => {
    const generator = new RegistryGenerator({
      routes: { only: ['users'], except: ['admin'] },
    })

    assert.throws(
      () => generator.filterRoute(makeRoutesListItem('users.index')),
      'Cannot use both "only" and "except" filters at the same time',
    )
  })
})
