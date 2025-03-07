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
import { assertExists } from '@adonisjs/core/helpers/assert'
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
  #cachedPkgJson?: Record<string, any>

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

  async #loadPkgJson() {
    if (this.#cachedPkgJson) return this.#cachedPkgJson

    try {
      const pkgJsonText = await readFile(
        fileURLToPath(new URL('./package.json', this.#appRoot)),
        'utf-8',
      )

      this.#cachedPkgJson = JSON.parse(pkgJsonText)
      return this.#cachedPkgJson
    } catch (error) {
      throw new Error('Unable to read the package.json file', { cause: error })
    }
  }

  #isPackageInstalled(name: string) {
    assertExists(
      this.#cachedPkgJson,
      'package.json should be loaded before checking if a package is installed',
    )

    return !!this.#cachedPkgJson.dependencies?.[name]
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

    if (!validateUsingCallNode) return

    const schema = validateUsingCallNode.getArguments()[0]

    /**
     * If the schema is an identifier
     */
    if (Node.isIdentifier(schema)) {
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

    /**
     * Handle case when the schema is defined as a static property in the controller :
     *
     * ```ts
     * export default class UsersController {
     *  static validator = vine.compile(vine.object({ limit: vine.number() }))
     *
     *  async index() {
     *   await request.validateUsing(UsersController.validator)
     *  }
     * }
     */
    if (Node.isPropertyAccessExpression(schema)) {
      const baseExpression = schema.getExpression()
      const propertyName = schema.getName()

      if (Node.isIdentifier(baseExpression)) {
        const className = baseExpression.getText()
        const classDeclaration = handlerData.file.getClass(className)
        if (!classDeclaration) return

        const staticProperty = classDeclaration.getStaticMember(propertyName)
        if (!staticProperty) return

        const importPath = classDeclaration.getSourceFile().getFilePath()
        const relativeImportPath = slash(relative(this.#getDestinationDirectory(), importPath))
        return `InferInput<typeof import('${relativeImportPath}').default['${propertyName}']>`
      }
    }
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
    const filePath = this.#getDestinationDirectory() + '/index.ts'

    const exist = existsSync(filePath)

    if (exist) {
      return
    }

    const file = this.#project.createSourceFile(filePath, '', {
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

  /**
   * If @tuyau/superjson is installed then we must use a special
   * type that will not type-serialize the response
   */
  #getMakeTuyauResponseType() {
    const isSuperJsonInstalled = this.#isPackageInstalled('@tuyau/superjson')
    return isSuperJsonInstalled ? 'MakeNonSerializedTuyauResponse' : 'MakeTuyauResponse'
  }

  async #writeApiFile(options: {
    routesNameArray: RouteNameArray
    definition: Record<string, any>
    typesByPattern: Record<string, any>
  }) {
    const file = this.#project.createSourceFile(this.#destination, '', { overwrite: true })

    if (!file) throw new Error('Unable to create the api.ts file')

    const isTuyauInertiaInstalled = this.#isPackageInstalled('@tuyau/inertia')
    const makeTuyauResponseType = this.#getMakeTuyauResponseType()

    file.removeText().insertText(0, (writer) => {
      writer
        .writeLine(`// @ts-nocheck`)
        .writeLine(`/* eslint-disable */`)
        .writeLine('// --------------------------------------------------')
        .writeLine('// This file is auto-generated by Tuyau. Do not edit manually !')
        .writeLine('// --------------------------------------------------')
        .writeLine('')
        .writeLine(
          `import type { MakeTuyauRequest, ${makeTuyauResponseType} } from '@tuyau/utils/types'`,
        )
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
    await this.#loadPkgJson()

    for (const route of routes) {
      /**
       * We don't support inline functions
       */
      if (typeof route.handler === 'function') continue

      /**
       * Get the controller file associated with this route
       */
      const routeHandler = await parseBindingReference(route.handler.reference)
      const file = sourcesFiles.find((sf) => {
        const filePath = sf.getFilePath()

        /**
         * Handle relative magic string
         */
        if (routeHandler.moduleNameOrPath.startsWith('./')) {
          return filePath.endsWith(
            routeHandler.moduleNameOrPath.replace('./', '').replace('.js', '.ts'),
          )
        }

        /**
         * Handle sub-paths imports
         */
        return filePath.endsWith(`${routeHandler.moduleNameOrPath.replace('#', '')}.ts`)
      })

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
        const makeTuyauResponseType = this.#getMakeTuyauResponseType()

        typesByPattern[typeName] = {
          request: schemaImport ? `MakeTuyauRequest<${schemaImport}>` : 'unknown',
          response: `${makeTuyauResponseType}<import('${relativePath}').default['${routeHandler.method}'], ${!!schemaImport}>`,
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
