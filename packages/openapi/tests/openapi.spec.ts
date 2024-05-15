import tsMorph from 'ts-morph'
import { test } from '@japa/runner'
import { fileURLToPath } from 'node:url'

import { typeFootprint } from '../src/footprint.js'
import { OpenApiGenerator } from '../src/generator.js'

test.group('OpenAPI', (group) => {
  test('basic', ({ assert }) => {
    const project = new tsMorph.Project({
      manipulationSettings: { quoteKind: tsMorph.QuoteKind.Single },
      tsConfigFilePath: new URL('../tsconfig.json', import.meta.url).pathname,
    })

    const sourceFile = project.getSourceFileOrThrow('tests/fixtures/routes.ts')

    const result = typeFootprint('tests/fixtures/routes.ts', 'AdonisApi', {
      tsConfigFilePath: fileURLToPath(new URL('../tsconfig.json', import.meta.url)),
    })

    console.log(result)
    // writeFileSync('__footprint.ts', result)

    const footprint = project.createSourceFile('__footprint.ts', result, {
      overwrite: true,
    })
    const apiDefinition = footprint.getInterfaceOrThrow('AdonisApi')

    new OpenApiGenerator(apiDefinition).generate()
  })
})
