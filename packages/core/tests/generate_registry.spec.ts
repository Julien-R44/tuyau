import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { test } from '@japa/runner'
import { RoutesScanner } from '@adonisjs/assembler/routes_scanner'
import type { ScannedRoute, RoutesListItem } from '@adonisjs/assembler/types'

import { generateRegistry } from '../src/backend/generate_registry.ts'
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

  test('compacts tokens, omitting empty suffixes and server-only fields', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.show',
        methods: ['GET'],
        pattern: '/users/:id.json',
        tokens: [
          { old: '/users/', type: 0, val: 'users', end: '' },
          { old: ':id.json', type: 1, val: 'id', end: '.json', matcher: /\d+/ } as any,
        ],
      }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateRuntimeContent(routes)

    assert.notInclude(content, 'matcher')
    assert.notInclude(content, '"old"')
    assert.include(content, 'tokens: [[0,"users"],[1,"id",".json"]]')
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

test.group('generateTypesContent | rawResponse union', () => {
  test('emits rawResponse wrapping the awaited return type', ({ assert }) => {
    const routes = [
      makeRoute({
        name: 'users.index',
        methods: ['GET'],
        pattern: '/users',
        response: { type: "ReturnType<UsersController['index']>", imports: [] },
      }),
    ]

    const generator = new RegistryGenerator()
    const content = generator.generateTypesContent(routes)

    assert.include(
      content,
      "rawResponse: ExtractRawResponse<Awaited<ReturnType<UsersController['index']>>>",
    )
  })

  test('unions the 422 validation error into rawResponse for validated routes', ({ assert }) => {
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
      "rawResponse: ExtractRawResponse<Awaited<ReturnType<UsersController['store']>>> | { status: 422; response: { errors: SimpleError[] } }",
    )
  })

  test('preserves an unknown success body for routes without a known return type', ({ assert }) => {
    const routes = [makeRoute({ name: 'home', methods: ['GET'], pattern: '/' })]

    const generator = new RegistryGenerator()
    const content = generator.generateTypesContent(routes)

    assert.include(content, 'rawResponse: ExtractRawResponse<unknown>')
  })

  test('preserves fallback successes alongside configured validation errors', ({ assert }) => {
    for (const type of [undefined, 'unknown', '{}']) {
      const route = makeRoute({
        name: 'users.store',
        methods: ['POST'],
        request: { type: 'InferInput<typeof createUserValidator>', imports: [] },
        response: type === undefined ? undefined : { type, imports: [] },
      })

      for (const validationErrorType of [undefined, 'MyValidationError', false] as const) {
        const generator = new RegistryGenerator({ validationErrorType })
        const content = generator.generateTypesContent([route])
        const validationError =
          validationErrorType === false
            ? ''
            : ` | { status: 422; response: ${validationErrorType ?? '{ errors: SimpleError[] }'} }`

        assert.include(
          content,
          `rawResponse: ExtractRawResponse<${type ?? 'unknown'}>${validationError}\n`,
        )
      }
    }
  })

  test('imports ExtractRawResponse from @tuyau/core/types', ({ assert }) => {
    const routes = [makeRoute({ name: 'home', methods: ['GET'], pattern: '/' })]

    const generator = new RegistryGenerator()
    const content = generator.generateTypesContent(routes)

    assert.match(content, /import type \{[^}]*ExtractRawResponse[^}]*\} from '@tuyau\/core\/types'/)
  })
})

test.group('generateRegistry hook', () => {
  test('keeps independent filters, including global and sticky regexes', async ({ assert, fs }) => {
    const events = { routesScanning: [] as Function[], routesScanned: [] as Function[] }
    const hooks = {
      add: (event: keyof typeof events, handler: Function) => events[event].push(handler),
    }
    const devServer = { ui: { logger: { info() {} } } }

    for (const hook of [
      generateRegistry({
        output: `${fs.basePath}/web`,
        routes: { only: [/^(users|shared)\./g] },
        typeAugmentation: false,
      }),
      generateRegistry({
        output: `${fs.basePath}/admin`,
        routes: { only: [/^(admin|shared)\./y] },
        typeAugmentation: false,
      }),
    ]) {
      await (hook as any).run({}, hooks)
    }

    const scanner = new RoutesScanner(fs.basePath, [])
    for (const handler of events.routesScanning) await handler(devServer, scanner)
    await scanner.scan(
      ['users.index', 'admin.dashboard', 'shared.health', 'internal.health'].map((name) =>
        makeRoute({ name }),
      ),
    )
    assert.deepEqual(
      scanner.getScannedRoutes().map((route) => route.name),
      ['users.index', 'admin.dashboard', 'shared.health'],
    )
    for (const handler of events.routesScanned) await handler(devServer, scanner)

    const web = await fs.contents('web/index.ts')
    const admin = await fs.contents('admin/index.ts')
    assert.include(web, "'users.index'")
    assert.include(web, "'shared.health'")
    assert.notInclude(web, "'admin.dashboard'")
    assert.notInclude(web, "'internal.health'")
    assert.include(admin, "'admin.dashboard'")
    assert.include(admin, "'shared.health'")
    assert.notInclude(admin, "'users.index'")
    assert.notInclude(admin, "'internal.health'")
  })
})

test.group('generated registry types', () => {
  test('exports isolated helpers with optional legacy augmentation')
    .with([true, false])
    .run(async ({ assert, fs }, augment) => {
      await fs.create('manifest.d.ts', 'export {}')
      await new RegistryGenerator(augment ? undefined : { typeAugmentation: false }).writeOutput({
        outputDir: `${fs.basePath}/web`,
        routes: [
          makeRoute({
            name: 'users.show',
            pattern: '/users/:id',
            tokens: [
              { old: '/users/', type: 0, val: 'users', end: '' },
              { old: ':id', type: 1, val: 'id', end: '' },
            ],
            request: { type: '{ params: { id: string }; page: number }', imports: [] },
            response: { type: '{ name: string }', imports: [] },
          }),
          makeRoute({
            name: 'users.store',
            pattern: '/users',
            methods: ['POST'],
            request: { type: '{ email: string; query: { notify: boolean } }', imports: [] },
            response: {
              type: '{ __response: { id: number }; __status: 201 } | { __response: { message: string }; __status: 409 }',
              imports: [],
            },
          }),
        ],
      })
      await new RegistryGenerator({ typeAugmentation: false }).writeOutput({
        outputDir: `${fs.basePath}/admin`,
        routes: [
          makeRoute({
            name: 'admin.dashboard',
            pattern: '/admin',
            response: { type: '{ revenue: number }', imports: [] },
          }),
        ],
      })

      await fs.create(
        'consumer.ts',
        `
import { registry as webRegistry } from './web/index.ts'
import { registry as adminRegistry } from './admin/index.ts'
import type { Route, Path } from './web/index.ts'
import type { Route as AdminRoute, Path as AdminPath } from './admin/index.ts'
import { createTuyau } from '@tuyau/core/client'
import type { UserRegistry, Route as GlobalRoute, Path as GlobalPath } from '@tuyau/core/types'

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false
type Check<T extends true> = T

export type Contracts = [
  Check<Equal<Route.Response<'users.show'>, { name: string }>>,
  Check<Equal<Path.Response<'GET', '/users/:id'>, { name: string }>>,
  Check<Equal<Route.Response<'users.store'>, { id: number }>>,
  Check<Equal<Path.Response<'POST', '/users'>, { id: number }>>,
  Check<Equal<Route.Body<'users.store'>, { email: string }>>,
  Check<Equal<Path.Body<'POST', '/users'>, { email: string }>>,
  Check<Equal<Route.Query<'users.show'>, { page: number }>>,
  Check<Equal<Path.Query<'GET', '/users/:id'>, { page: number }>>,
  Check<Equal<Route.Query<'users.store'>, { notify: boolean }>>,
  Check<Equal<Path.Query<'POST', '/users'>, { notify: boolean }>>,
  Check<Equal<Route.Params<'users.show'>, { id: string | number | bigint | boolean }>>,
  Check<Equal<Path.Params<'GET', '/users/:id'>, { id: string | number | bigint | boolean }>>,
  Check<Equal<AdminRoute.Response<'admin.dashboard'>, { revenue: number }>>,
  Check<Equal<AdminPath.Response<'GET', '/admin'>, { revenue: number }>>,
  ${
    augment
      ? `
  Check<Equal<UserRegistry['routes'], typeof webRegistry.routes>>,
  Check<Equal<UserRegistry['$tree'], typeof webRegistry.$tree>>,
  Check<Equal<GlobalRoute.Response<'users.store'>, { id: number }>>,
  Check<Equal<GlobalPath.Response<'GET', '/users/:id'>, { name: string }>>,
  `
      : 'Check<Equal<keyof UserRegistry, never>>,'
  }
]

export const request: Route.Request<'users.store'> = {
  body: { email: 'alice@example.com' }, query: { notify: true },
}
export const pathRequest: Path.Request<'POST', '/users'> = request

export function checkErrors(route: Route.Error<'users.store'>, path: Path.Error<'POST', '/users'>) {
  if (route.isStatus(409)) {
    const message: string = route.response.message
    // @ts-expect-error A conflict response does not have a success payload.
    route.response.id
    void message
  }
  if (path.isStatus(409)) {
    const message: string = path.response.message
    // @ts-expect-error Error payloads must not degrade to any.
    path.response.id
    void message
  }
}

createTuyau({ baseUrl: 'https://example.test', registry: webRegistry }).api.users.show({ params: { id: 1 }, query: { page: 2 } })
createTuyau({ baseUrl: 'https://example.test', registry: adminRegistry }).api.admin.dashboard({})

// @ts-expect-error Admin routes are not part of the public registry.
type ForeignRoute = Route.Response<'admin.dashboard'>
// @ts-expect-error Public routes are not part of the admin registry.
type ForeignAdminRoute = AdminRoute.Response<'users.show'>
// @ts-expect-error Admin paths are not part of the public registry.
type ForeignPath = Path.Response<'GET', '/admin'>
// @ts-expect-error Public paths are not part of the admin registry.
type ForeignAdminPath = AdminPath.Response<'GET', '/users/:id'>
// @ts-expect-error The path must support the specified method.
type WrongMethod = Path.Response<'POST', '/users/:id'>
// @ts-expect-error The generated request body remains validated.
export const invalidRequest: Path.Request<'POST', '/users'> = { body: { email: 123 } }
`,
      )

      const program = ts.createProgram([`${fs.basePath}/consumer.ts`], {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.NodeNext,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        skipLibCheck: false,
        allowImportingTsExtensions: true,
        paths: {
          '@tuyau/core/types': [
            fileURLToPath(new URL('../src/client/types/index.ts', import.meta.url)),
          ],
          '@tuyau/core/client': [fileURLToPath(new URL('../src/client/index.ts', import.meta.url))],
          '@vinejs/vine/types': [
            fileURLToPath(import.meta.resolve('@vinejs/vine/types')).replace(/\.js$/, '.d.ts'),
          ],
        },
      })
      assert.deepEqual(
        ts
          .getPreEmitDiagnostics(program)
          .map(
            (diagnostic) =>
              `${diagnostic.file?.fileName}: TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n').slice(0, 500)}`,
          ),
        [],
      )
    })
    .timeout(30_000)
})
