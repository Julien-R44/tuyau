import { Project, QuoteKind } from 'ts-morph'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

import { ApiTypesGenerator } from '../src/codegen/api_types_generator.js'

export default class CodegenTypes extends BaseCommand {
  static override commandName = 'tuyau:generate'
  static override description = 'Tuyau generator command'

  static override options: CommandOptions = { startApp: true }

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
      tsConfigFilePath: new URL('./tsconfig.json', this.app.appRoot).pathname,
      manipulationSettings: { quoteKind: QuoteKind.Single },
    })

    const apiTypesGenerator = new ApiTypesGenerator({
      project,
      appRoot: this.app.appRoot,
      routes: await this.#getRoutes(),
      config: this.app.config.get('tuyau'),
      logger: this.logger,
    })

    await apiTypesGenerator.generate()

    this.logger.success('Types generated successfully')
  }
}
