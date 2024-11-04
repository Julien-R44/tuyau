import { Node } from 'ts-morph'
// @ts-expect-error untyped
import matchit from '@poppinss/matchit'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import type { Logger } from '@poppinss/cliui'
import { dirname, relative } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import string from '@adonisjs/core/helpers/string'
import type { RouteJSON } from '@adonisjs/core/types/http'
import { parseBindingReference, slash } from '@adonisjs/core/helpers'
import type { MethodDeclaration, Project, SourceFile } from 'ts-morph'

import type { TuyauConfig } from '../types.js'

type HandlerData = { method: MethodDeclaration; body: Node; file: SourceFile }

type RouteReferenceParsed = Awaited<ReturnType<typeof parseBindingReference>>

type RouteNameArray = {
  params: any
  name: string | undefined
  path: string
  method: string[]
  types: string
}[]

export class ApiTypesGenerator {
  #appRoot: URL
  #logger: Logger
  #project: Project
  #config: TuyauConfig
  #routes: Array<RouteJSON>

  #destination!: string
  #isTuyauInertiaInstalledCached?: boolean

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

  /**
   * Check if the @tuyau/inertia package is installed.
   */
  async #isTuyauInertiaInstalled() {
    if (this.#isTuyauInertiaInstalledCached !== undefined)
      return this.#isTuyauInertiaInstalledCached

    try {
      const pkgJsonText = await readFile(
        fileURLToPath(new URL('./package.json', this.#appRoot)),
        'utf-8',
      )

      const pkgJson = JSON.parse(pkgJsonText)
      this.#isTuyauInertiaInstalledCached = !!pkgJson.dependencies?.['@tuyau/inertia']
      return this.#isTuyauInertiaInstalledCached
    } catch (error) {
      throw new Error('Unable to read the package.json file', { cause: error })
    }
  }

  #getDestinationDirectory() {
    return dirname(this.#destination)
  }

  /**
   * Create the destination directory if it does not exists
   */
  #prepareDestination() {
    this.#destination = fileURLToPath(new URL('./.adonisjs/api.ts', this.#appRoot))
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

    return { method, body, file }
  }

  /**
   * Get the import type of an identifier
   */
  #getIdentifierImportType(identifier: Node) {
    const sourceFile = identifier.getSourceFile()

    const namedImport = sourceFile.getImportDeclaration((importNode) => {
      const namedImports = importNode.getNamedImports()
      if (namedImports.find((namedImport) => namedImport.getName() === identifier.getText())) {
        return true
      }

      return false
    })

    const defaultImport = sourceFile.getImportDeclaration((importNode) => {
      if (importNode.getDefaultImport()?.getText() === identifier.getText()) return true

      return false
    })

    const isValidFile = (namedImport || defaultImport)?.getModuleSpecifierSourceFile()
    if (!isValidFile) return undefined

    if (namedImport) return 'named'
    if (defaultImport) return 'default'

    return undefined
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

      const definition = schema.getDefinitions().at(0)
      const importType = this.#getIdentifierImportType(schema)
      const isReExportedFromThisFile = definition
        ? handlerData.file.getExportedDeclarations().has(definition.getNode().getText())
        : false

      if (!importType && !isReExportedFromThisFile) {
        this.#logger.warning(`Unable to find the schema file for ${schema.getText()}`)
        return
      }

      const importPath = definition!.getSourceFile().getFilePath()
      const relativeImportPath = slash(relative(this.#getDestinationDirectory(), importPath))

      const propName = importType === 'default' ? 'default' : schema.getText()
      return `InferInput<typeof import('${relativeImportPath}')['${propName}']>`
    }

    return undefined
  }

  /**
   * Generate the final interface containing all routes, request, and response
   */
  #generateDefinitionInterface(types: Record<string, any>, indent = '  ') {
    let interfaceContent = ''

    Object.entries(types).forEach(([key, value]) => {
      if (typeof value === 'object') {
        interfaceContent += `${indent}'${key}': {\n`
        interfaceContent += this.#generateDefinitionInterface(value, indent + '  ')
        interfaceContent += `${indent}};\n`
      } else {
        interfaceContent += `${indent}'${key}': ${value};\n`
      }
    })

    return interfaceContent
  }

  /**
   * Filter routes to generate based on the config
   */
  #filterRoutes(routes: Array<RouteJSON>, mode: 'definitions' | 'routes') {
    const config = this.#config.codegen?.[mode]
    if (!config || (!config.only && !config.except)) return routes

    return routes.filter((route) => {
      if (typeof config.only === 'function') return config.only(route)
      if (typeof config.except === 'function') return !config.except(route)

      if (config.only) {
        for (const pattern of config.only) {
          if (pattern instanceof RegExp && pattern.test(route.pattern)) return true
          if (route.pattern === pattern) return true
        }

        return false
      }

      if (config.except) {
        for (const pattern of config.except) {
          if (pattern instanceof RegExp && pattern.test(route.pattern)) return false
          if (route.pattern === pattern) return false
        }

        return true
      }

      return true
    })
  }

  /**
   * Generate a type name based on the route pattern and methods
   *
   * GET /users/:id => UsersIdGet
   */
  #generateTypeName(route: { pattern: string; methods: string[] }) {
    const remappedSegments = route.pattern
      .split('/')
      .filter(Boolean)
      .map((segment) => (segment.startsWith(':') ? 'id' : segment))
      .join(' ')

    const methods = string.pascalCase(route.methods.join(' '))
    return string.pascalCase(remappedSegments) + methods
  }

  #generateRoutesNameArray(
    routes: RouteJSON[],
    typesByPattern: Record<string, any>,
  ): RouteNameArray {
    return routes
      .map(({ name, pattern, methods }) => {
        // type != 0 === dynamic
        const params = matchit
          .parse(pattern)
          .filter((node: any) => node.type !== 0)
          .map((node: any) => node.val)

        /**
         * If the types wasn't generated, we fallback to `unknown` type
         */
        let typeName = this.#generateTypeName({ pattern, methods })
        if (!typesByPattern[typeName]) typeName = 'unknown'

        return { params, name, path: pattern, method: methods, types: typeName }
      })
      .filter((route) => !!route.name)
  }

  async #writeIndexFile() {
    const file = this.#project.createSourceFile(this.#getDestinationDirectory() + '/index.ts', '', {
      overwrite: true,
    })

    if (!file) throw new Error('Unable to create the index.ts file')

    file.removeText().insertText(0, (writer) => {
      writer.writeLine(`/// <reference path="../adonisrc.ts" />`)

      writer.newLine()

      writer.writeLine(`export * from './api.js'`)
    })

    await file.save()
  }

  async #writeApiFile(options: {
    routesNameArray: RouteNameArray
    definition: Record<string, any>
    typesByPattern: Record<string, any>
  }) {
    const file = this.#project.createSourceFile(this.#destination, '', { overwrite: true })

    if (!file) throw new Error('Unable to create the api.ts file')

    const isTuyauInertiaInstalled = await this.#isTuyauInertiaInstalled()

    file.removeText().insertText(0, (writer) => {
      writer
        .writeLine(`import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'`)
        .writeLine(`import type { InferInput } from '@vinejs/vine/types'`)
        .newLine()

      /**
       * Write every type by route pattern
       */
      Object.entries(options.typesByPattern).forEach(([key, value]) => {
        writer.writeLine(`type ${key} = {`)
        writer.writeLine(`  request: ${value.request}`)
        writer.writeLine(`  response: ${value.response}`)
        writer.writeLine(`}`)
      })

      /**
       * Write the nested ApiDefinition interface
       */
      writer
        .writeLine(`export interface ApiDefinition {`)
        .write(this.#generateDefinitionInterface(options.definition, '  '))
        .writeLine(`}`)

      /**
       * Write the array of routes with their names
       */
      writer.writeLine(`const routes = [`)
      for (const route of options.routesNameArray) {
        writer.writeLine(`  {`)
        writer.writeLine(`    params: ${JSON.stringify(route.params)},`)
        writer.writeLine(`    name: '${route.name}',`)
        writer.writeLine(`    path: '${route.path}',`)
        writer.writeLine(`    method: ${JSON.stringify(route.method)},`)
        writer.writeLine(`    types: {} as ${route.types},`)
        writer.writeLine(`  },`)
      }
      writer.writeLine(`] as const;`)

      /**
       * The final API object that will be exported and used by the client
       */
      writer
        .writeLine(`export const api = {`)
        .writeLine(`  routes,`)
        .writeLine(`  definition: {} as ApiDefinition`)
        .writeLine(`}`)

      /**
       * Write the module augmentation for the tuyau/inertia/types module
       */
      if (isTuyauInertiaInstalled) {
        writer.writeLine(`declare module '@tuyau/inertia/types' {`)
        writer.writeLine(`  type InertiaApi = typeof api`)
        writer.writeLine(`  export interface Api extends InertiaApi {}`)
        writer.writeLine(`}`)
      }
    })

    await file.save()
  }

  async generate() {
    /**
     * The definition object to generate
     */
    const definition: Record<string, any> = {}

    /**
     * A map of types { request, response } by route pattern
     */
    const typesByPattern: Record<string, any> = {}

    const sourcesFiles = this.#project.getSourceFiles()
    const routes = this.#filterRoutes(this.#routes, 'definitions')

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

      let currentLevel = definition
      const relativePath = slash(relative(this.#getDestinationDirectory(), file.getFilePath()))
      segments.forEach((segment, i) => {
        if (!currentLevel[segment]) currentLevel[segment] = {}

        currentLevel = currentLevel[segment]
        if (i !== segments.length - 1) return

        /**
         * Store the request and response types by pattern
         */
        const typeName = this.#generateTypeName(route)
        typesByPattern[typeName] = {
          request: schemaImport ? `MakeTuyauRequest<${schemaImport}>` : 'unknown',
          response: `MakeTuyauResponse<import('${relativePath}').default['${routeHandler.method}']>`,
        }

        currentLevel.$url = {}
        for (const method of methods) currentLevel[method] = typeName
      })
    }

    /**
     * Generate named routes values
     */
    const routesNameArray = this.#generateRoutesNameArray(
      this.#filterRoutes(routes, 'routes'),
      typesByPattern,
    )

    /**
     * Write the final api.ts & index.ts file
     */
    await this.#writeApiFile({ definition, typesByPattern, routesNameArray })
    await this.#writeIndexFile()
  }
}
