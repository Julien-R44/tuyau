import './types.js'

import type { AllHooks } from '@adonisjs/assembler/types'

import { RegistryGenerator } from './registry_generator.js'
import { GenerateRegistryConfig } from './types.js'

/**
 * AdonisJS assembler hook that scans routes and generates
 * the tuyau typed client registry files (runtime, schema, tree).
 */
export function generateRegistry(options?: GenerateRegistryConfig): AllHooks['init'][number] {
  const generator = new RegistryGenerator(options)
  const outputDir = options?.output ?? './.adonisjs/client/registry'

  return {
    async run(_, hooks) {
      hooks.add('routesScanning', (_, routesScanner) => {
        routesScanner.filter((route) => generator.filterRoute(route))
      })

      hooks.add('routesScanned', async (devServer, routesScanner) => {
        const startTime = process.hrtime()
        const routes = routesScanner.getScannedRoutes()

        await generator.writeOutput({ outputDir, routes })

        devServer.ui.logger.info(`tuyau: created api client registry (${outputDir})`, {
          startTime,
        })
      })
    },
  } satisfies AllHooks['init'][number]
}
