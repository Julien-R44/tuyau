import { Node } from 'ts-morph'
import { fileURLToPath } from 'node:url'
import type { Logger } from '@poppinss/cliui'
import { dirname, relative } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import type { RouteJSON } from '@adonisjs/core/types/http'
import { parseBindingReference } from '@adonisjs/core/helpers'
import type { MethodDeclaration, Project, SourceFile } from 'ts-morph'

import type { TuyauConfig } from '../types.js'

type HandlerData = { method: MethodDeclaration; body: Node }

type RouteReferenceParsed = Awaited<ReturnType<typeof parseBindingReference>>

export class ApiTypesGenerator {
  #appRoot: URL
  #logger: Logger
  #project: Project
  #config: TuyauConfig
  #routes: Array<RouteJSON>

  #destination!: URL

  constructor(options: {
    appRoot: URL
    project: Project
    config: TuyauConfig
    routes: Array<RouteJSON>
    logger: Logger
  }) {
    this.#config = options.config
    this.#routes = options.routes
    this.#logger = options.logger
    this.#project = options.project
    this.#appRoot = options.appRoot

    this.#prepareDestination()
  }

  #getDestinationDirectory() {
    return dirname(this.#destination.pathname)
  }

  /**
   * Create the destination directory if it does not exists
   */
  #prepareDestination() {
    this.#destination = new URL('./.adonisjs/types/api.d.ts', this.#appRoot)
    const directory = this.#getDestinationDirectory()
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true })
    }
  }

  /**
   * Extract class and method of the route handler
   */
  #extractClassHandlerData(
    file: SourceFile,
    routeHandler: RouteReferenceParsed,
  ): HandlerData | undefined {
    const classDef = file.getClasses().find((c) => c.isDefaultExport())
    if (!classDef) return

    const method = classDef.getMethod(routeHandler.method)
    if (!method) return

    const body = method.getBody()
    if (!body) return

    return { method, body }
  }

  /**
   * We have multiple ways to get the request payload :
   * - First we check if a FormRequest is used
   * - Other we check if we have a Single Action Controller
   * - Otherwise, we check if a request.validateUsing is used
   *
   * This method will returns the path to the schema file
   */
  #extractRequest(handlerData: HandlerData) {
    /**
     * 1. Search for a call to validateUsing in the controller
     */
    const validateUsingCallNode = handlerData.method.forEachDescendant((node) => {
      if (!Node.isCallExpression(node)) return false

      if (node.getExpression().getText().includes('validateUsing')) {
        return node
      }

      return false
    })

    if (validateUsingCallNode) {
      const schema = validateUsingCallNode.getArguments()[0]
      if (!Node.isIdentifier(schema)) return

      const importPath = schema.getImplementations()[0].getSourceFile().getFilePath()
      const relativeImportPath = relative(this.#getDestinationDirectory(), importPath)

      return `InferInput<typeof import('${relativeImportPath}')['${schema.getText()}']>`
    }

    return undefined
  }

  /**
   * Generate the final interface containing all routes, request, and response
   */
  #generateFinalInterface(types: Record<string, any>, indent = '  ') {
    let interfaceContent = ''

    Object.entries(types).forEach(([key, value]) => {
      if (typeof value === 'object') {
        interfaceContent += `${indent}'${key}': {\n`
        interfaceContent += this.#generateFinalInterface(value, indent + '  ')
        interfaceContent += `${indent}};\n`
      } else {
        interfaceContent += `${indent}'${key}': ${value};\n`
      }
    })

    return interfaceContent
  }

  /**
   * Write the final interface containing all routes, request, and response
   * in a routes.d.ts file
   */
  async #writeFinalInterface(types: Record<string, any>) {
    const file = this.#project.createSourceFile(fileURLToPath(this.#destination), '', {
      overwrite: true,
    })

    if (!file) throw new Error('Unable to create the api.d.ts file')

    file?.removeText()

    file.insertText(0, (writer) => {
      writer
        .writeLine(
          `import type { MakeOptional, Serialize, Simplify, ConvertReturnTypeToRecordStatusResponse } from '@tuyau/utils/types'`,
        )
        .writeLine(`import type { InferInput } from '@vinejs/vine/types'`)
        .newLine()
        .writeLine(`export interface AdonisApi {`)
        .write(this.#generateFinalInterface(types, '  '))
        .writeLine(`}`)
    })

    await file.save()
  }

  /**
   * Filter routes to generate based on the ignoreRoutes config
   */
  #filterRoutesToGenerate(routes: Array<RouteJSON>) {
    return routes.filter((route) => {
      if (!this.#config.codegen?.ignoreRoutes) return true

      if (typeof this.#config.codegen?.ignoreRoutes === 'function') {
        return !this.#config.codegen.ignoreRoutes(route)
      }

      for (const ignore of this.#config.codegen.ignoreRoutes) {
        if (typeof ignore === 'string' && route.pattern === ignore) return false
        if (ignore instanceof RegExp && ignore.test(route.pattern)) return false
      }

      return true
    })
  }

  async generate() {
    const types: Record<string, any> = {}
    const sourcesFiles = this.#project.getSourceFiles()
    const routes = this.#filterRoutesToGenerate(this.#routes)

    for (const route of routes) {
      /**
       * We don't support inline functions
       */
      if (typeof route.handler === 'function') continue

      /**
       * Get the controller file associated with this route
       */
      const routeHandler = await parseBindingReference(route.handler.reference)
      const file = sourcesFiles.find((sf) =>
        sf.getFilePath().endsWith(`${routeHandler.moduleNameOrPath.replace('#', '')}.ts`),
      )

      if (!file) {
        this.#logger.warning(`Unable to find the controller file for ${route.pattern}`)
        continue
      }

      this.#logger.info(`Generating types for ${route.pattern}`)

      /**
       * Extract the class and method of the controller
       */
      const handlerData = this.#extractClassHandlerData(file, routeHandler)
      if (!handlerData) {
        this.#logger.warning(`Unable to find the controller method for ${route.pattern}`)
        continue
      }

      /**
       * Extract the request schema associated with this route
       */
      const schemaImport = this.#extractRequest(handlerData)

      /**
       * Get the methods associated with this route
       */
      const methods = route.methods
        .map((method) => '$' + method.toLowerCase())
        .filter((method) => method !== 'head')

      const segments = route.pattern.split('/').filter(Boolean) as string[]

      let currentLevel = types
      const relativePath = relative(this.#getDestinationDirectory(), file.getFilePath())
      segments.forEach((segment, i) => {
        if (!currentLevel[segment]) {
          currentLevel[segment] = {}
        }

        currentLevel = currentLevel[segment]

        if (i === segments.length - 1) {
          currentLevel['$url'] = {}
          for (const method of methods) {
            currentLevel[method] = {
              request: schemaImport ? `MakeOptional<${schemaImport}>` : 'unknown',
              response: `Simplify<Serialize<ConvertReturnTypeToRecordStatusResponse<Awaited<ReturnType<typeof import('${relativePath}').default['prototype']['${routeHandler.method}']>>>>>`,
            }
          }
        }
      })
    }

    await this.#writeFinalInterface(types)
  }
}
