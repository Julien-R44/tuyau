import tsMorph from 'ts-morph'

import { typeFootprint } from './footprint.js'

export class OpenApiGenerator {
  #project: tsMorph.Project

  constructor(private apiDefinition: tsMorph.InterfaceDeclaration) {
    this.#project = new tsMorph.Project({
      manipulationSettings: { quoteKind: tsMorph.QuoteKind.Single },
      tsConfigFilePath: new URL('./tsconfig.json', import.meta.url).pathname,
    })
  }

  #flattenInterface(
    definition: tsMorph.InterfaceDeclaration,
    prefix = '',
    result: Record<string, any> = {},
  ) {
    const methods = ['$get', '$head', '$post', '$put', '$patch', '$delete']
    for (const prop of definition.getProperties()) {
      const type = prop.getType()
      const properties = type.getProperties()
      const isEndpoint = type.isObject() && properties.some((p) => p.getName() === '$url')

      if (isEndpoint) {
        const name = prop.getName().replace(/'/g, '')
        for (const method of methods) {
          const methodSymbol = type.getProperty(method)
          if (methodSymbol) {
            const methodType = methodSymbol.getValueDeclaration()?.getType()
            const requestType = methodType?.getProperty('request')
            const responseType = methodType?.getProperty('response')

            const requestDefinition = requestType?.getValueDeclarationOrThrow().getType()

            typeFootprint()
            console.log(requestDefinition?.getText())
          }
        }
        result[`${prefix}/${name}`] = {
          $url: {},
        }
        // this.#flattenInterface(type.getSymbolOrThrow().getDeclarations()[0] as tsMorph.InterfaceDeclaration, result)
      } else {
        result[prop.getName()] = type.getText()
      }
    }

    return result
  }

  async generate() {
    // const sourceFile = this.#project.getSourceFileOrThrow('.adonisjs/api.ts')
    // const apiDefinition = sourceFile.getInterfaceOrThrow('AdonisApi')

    const result = this.#flattenInterface(this.apiDefinition)

    console.log(result)
  }
}
