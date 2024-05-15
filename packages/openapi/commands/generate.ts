import { Project, QuoteKind } from 'ts-morph'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

import { OpenApiGenerator } from '../src/generator.js'

export default class CodegenTypes extends BaseCommand {
  static override commandName = 'tuyau:generate:openapi'
  static override description = 'Automatically a full OpenAPI documentation from your codebase'
  static override options: CommandOptions = { startApp: true }

  @flags.boolean({ description: 'Verbose logs', default: false, alias: 'v' })
  declare verbose: boolean

  /**
   * Get routes from the router instance
   */
  async #getRoutes() {
    const router = await this.app.container.make('router')
    router.commit()

    return router.toJSON().root
  }

  /**
   * Execute command
   */
  override async run() {
    const project = new Project({
      manipulationSettings: { quoteKind: QuoteKind.Single },
      tsConfigFilePath: new URL('./tsconfig.json', this.app.appRoot).pathname,
    })

    const routes = this.#getRoutes()

    // @ts-expect-error tkt
    const apiTypesGenerator = new OpenApiGenerator({
      // project,
      // logger: this.logger,
      // appRoot: this.app.appRoot,
      // routes: await this.#getRoutes(),
      // config: this.app.config.get('tuyau'),
    })

    project
    routes
    apiTypesGenerator

    // await apiTypesGenerator.generate()

    this.logger.success('Types generated successfully')
  }
}
