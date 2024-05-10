import tsMorph from 'ts-morph'
import { test } from '@japa/runner'
import { fileURLToPath } from 'node:url'

import { typeFootprint } from '../footprint.js'
import { OpenApiGenerator } from '../openapi_provider.js'

test.group('OpenAPI', (group) => {
  test('basic', ({ assert }) => {
    const project = new tsMorph.Project({
      manipulationSettings: { quoteKind: tsMorph.QuoteKind.Single },
      tsConfigFilePath: new URL('../tsconfig.json', import.meta.url).pathname,
    })

    const sourceFile = project.getSourceFileOrThrow('tests/fixtures/routes.ts')
    // const apiDefinition = sourceFile.getInterfaceOrThrow('AdonisApi')

    const result = typeFootprint('tests/fixtures/routes.ts', 'AdonisApi', {
      tsConfigFilePath: fileURLToPath(new URL('../tsconfig.json', import.meta.url)),
    })

    console.log(result)

    // const generator = new OpenApiGenerator(apiDefinition)
    // generator.generate()
  })
})
