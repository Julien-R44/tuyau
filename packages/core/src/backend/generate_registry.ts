import './types.ts'

import type { AllHooks } from '@adonisjs/assembler/types'
import type { RoutesScanner } from '@adonisjs/assembler/routes_scanner'

import { RegistryGenerator } from './registry_generator.ts'
import { GenerateRegistryConfig } from './types.ts'

/**
 * Generators sharing a routes scanner. The scanner holds a single filter,
 * so it must keep every route that at least one registry needs.
 */
const generatorsByScanner = new WeakMap<RoutesScanner, Set<RegistryGenerator>>()

/**
 * AdonisJS assembler hook that scans routes and generates
 * the tuyau typed client registry files (runtime, schema, tree).
 *
 * Can be registered several times with different `output` and `routes`
 * options to generate several registries from the same routes.
 */
export function generateRegistry(options?: GenerateRegistryConfig): AllHooks['init'][number] {
  const generator = new RegistryGenerator(options)
  const outputDir = options?.output ?? './.adonisjs/client/registry'

  return {
    async run(_, hooks) {
      hooks.add('routesScanning', (_, routesScanner) => {
        const generators = generatorsByScanner.get(routesScanner) ?? new Set()
        generators.add(generator)
        generatorsByScanner.set(routesScanner, generators)

        routesScanner.filter((route) => [...generators].some((each) => each.filterRoute(route)))
      })

      hooks.add('routesScanned', async (devServer, routesScanner) => {
        const startTime = process.hrtime()
        const routes = routesScanner
          .getScannedRoutes()
          .filter((route) => generator.filterRoute(route))

        await generator.writeOutput({ outputDir, routes })

        devServer.ui.logger.info(`tuyau: created api client registry (${outputDir})`, {
          startTime,
        })
      })
    },
  } satisfies AllHooks['init'][number]
}
