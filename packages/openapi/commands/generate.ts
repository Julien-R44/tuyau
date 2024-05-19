import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'
import type { TuyauConfig } from '@tuyau/core/types'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

import { metaStore } from '../src/meta_store.js'
import { OpenApiGenerator } from '../src/generator.js'

export default class CodegenTypes extends BaseCommand {
  static override commandName = 'tuyau:generate:openapi'
  static override description = 'Automatically a full OpenAPI documentation from your codebase'
  static override options: CommandOptions = { startApp: true }

  @flags.boolean({ description: 'Verbose logs', default: false, alias: 'v' })
  declare verbose: boolean

  /**
   * Execute command
   */
  override async run() {
    const config = this.app.config.get<TuyauConfig>('tuyau')
    const tsConfigFilePath = join(fileURLToPath(this.app.appRoot), './tsconfig.json')
    const destination = join(fileURLToPath(this.app.appRoot), './openapi.yaml')

    const openApiSpec = await new OpenApiGenerator(config, metaStore, tsConfigFilePath).generate()

    writeFile(destination, openApiSpec, 'utf-8')
    this.logger.success(`OpenAPI spec generated at ${destination}`)
  }
}
