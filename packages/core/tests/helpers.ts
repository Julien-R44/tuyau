import { fileURLToPath } from 'node:url'
import { getActiveTest } from '@japa/runner'
import { Project, QuoteKind } from 'ts-morph'
import string from '@adonisjs/core/helpers/string'

export function getActiveTestContextOrThrow() {
  const test = getActiveTest()
  if (!test) throw new Error('Missing active test')

  return test.context
}

/**
 * Setup a new project with a tsconfig.json file
 */
export async function setupProject(options?: { packageJson?: Record<string, any> }) {
  const { fs } = getActiveTestContextOrThrow()

  await fs.createJson('tsconfig.json', { include: ['**/*'] })
  await fs.createJson('package.json', {
    type: 'module',
    imports: { '#controllers/*': './app/controllers/*.js' },
    ...options?.packageJson,
  })

  return new Project({
    tsConfigFilePath: fileURLToPath(new URL('./tsconfig.json', fs.baseUrl)),
    manipulationSettings: { quoteKind: QuoteKind.Single },
  })
}

/**
 * Create a new controller file with the given validator/return type
 */
export async function createController(options: {
  name: string
  returnType: string
  validator?: {
    path: string
    name: string
    defaultExport?: boolean
  }
}) {
  const { fs } = getActiveTestContextOrThrow()
  const path = `app/controllers/${string.snakeCase(options.name)}.ts`
  const validateUsing = options.validator
    ? `await request.validateUsing(${options.validator.name})`
    : ''

  const schemaImport = options.validator
    ? options.validator.defaultExport
      ? `import ${options.validator.name} from '../../${options.validator.path.replace('.ts', '.js')}'`
      : `import { ${options.validator.name} } from '../../${options.validator.path.replace('.ts', '.js')}'`
    : ''

  await fs.create(
    path,
    `${schemaImport}
    export default class ${options.name} {
      public async index() {
        ${validateUsing}
        return ${options.returnType}
      }
    }`,
  )

  return {
    pattern: `/${string.snakeCase(options.name.replace('Controller', ''))}`,
    methods: ['GET'],
    handler: {
      reference: `#controllers/${string.snakeCase(options.name)}.index`,
      handle: () => {},
    },
    domain: 'root',
  } as any
}

/**
 * Create a new validator file
 */
export async function createValidator(options: {
  name: string
  schema: string
  defaultExport?: boolean
}) {
  const { fs } = getActiveTestContextOrThrow()
  const path = `app/validators/${string.snakeCase(options.name)}.ts`

  if (options.defaultExport) {
    await fs.create(
      path,
      `import vine from '@vinejs/vine'
      export default vine.compile(vine.object(${options.schema}))`,
    )
  } else {
    await fs.create(
      path,
      `import vine from '@vinejs/vine'
      export const ${options.name} = vine.compile(vine.object(${options.schema}))`,
    )
  }

  return { path, name: options.name, defaultExport: options.defaultExport ?? false }
}
