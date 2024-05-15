import tsMorph from 'ts-morph'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { OpenAPIV3_1 } from 'openapi-types'
import type { TuyauConfig } from '@tuyau/core/types'
import { Route, RouteResource } from '@adonisjs/core/http'
import type { ApplicationService } from '@adonisjs/core/types'
import type { ResourceActionNames } from '@adonisjs/core/types/http'

import { typeFootprint } from '../src/footprint.js'
import { OpenApiGenerator } from '../src/generator.js'
import { scalarRenderer } from '../src/scalar/renderer.js'
import { swaggerUiRenderer } from '../src/swagger/renderer.js'
import type { SwaggerUIOptions } from '../src/swagger/types.js'
import type { ReferenceConfiguration as ScalarConfiguration } from '../src/scalar/types/index.js'

type RouteResourceDetailOptions<ActionNames extends ResourceActionNames> = {
  global?: OpenAPIV3_1.OperationObject
  actions?: { [K in ActionNames]?: OpenAPIV3_1.OperationObject }
}

declare module '@adonisjs/core/http' {
  export interface Route {
    detail: (detail: OpenAPIV3_1.OperationObject) => this
  }

  export interface RouteResource<ActionNames extends ResourceActionNames = ResourceActionNames> {
    detail: (options: RouteResourceDetailOptions<ActionNames>) => this
  }
}

declare module '@tuyau/core/types' {
  export interface TuyauConfig {
    openapi?: {
      /**
       * Provider to use for the OpenAPI UI
       *
       * @default scalar
       */
      provider?: 'scalar' | 'swagger-ui'

      /**
       * Options for configuring Scalar if `provider` is set to `scalar`
       * See https://github.com/scalar/scalar?tab=readme-ov-file#configuration
       */
      scalar?: ScalarConfiguration

      /**
       * Options for configuring Swagger UI if ` is set to `swagger-ui`
       * See https://swagger.io/specification/v2/
       */
      swagger?: Omit<
        Partial<SwaggerUIOptions>,
        | 'dom_id'
        | 'dom_node'
        | 'spec'
        | 'url'
        | 'urls'
        | 'layout'
        | 'pluginsOptions'
        | 'plugins'
        | 'presets'
        | 'onComplete'
        | 'requestInterceptor'
        | 'responseInterceptor'
        | 'modelPropertyMacro'
        | 'parameterMacro'
      >

      paths?: {
        /**
         * Endpoint that serves the OpenAPI UI
         *
         * @default /docs
         */
        ui?: string

        /**
         * Endpoint that serves the OpenAPI spec file
         *
         * @default /openapi
         */
        spec?: string
      }

      /**
       * Paths to exclude from the OpenAPI documentation
       */
      exclude?: Array<string | RegExp>

      /**
       * OpenAPI documentation
       */
      documentation?: Omit<
        OpenAPIV3_1.Document,
        | 'x-express-openapi-additional-middleware'
        | 'x-express-openapi-validation-strict'
        | 'openapi'
      >
    }
  }
}

export class MetaStore {
  #store = new Map<string, any>()

  set(key: string, value: any) {
    this.#store.set(key, value)
  }

  get(key: string) {
    return this.#store.get(key)
  }
}

export default class OpenApiProvider {
  #config!: TuyauConfig
  #metaStore = new MetaStore()

  constructor(protected app: ApplicationService) {}

  register() {
    const metaStore = this.#metaStore
    Route.macro('detail', function (this: Route, detail: OpenAPIV3_1.OperationObject) {
      metaStore.set(this.getPattern(), detail)
      return this
    })

    RouteResource.macro(
      'detail',
      function (this: RouteResource, options: RouteResourceDetailOptions<any>) {
        this.routes.forEach((route) => {
          metaStore.set(route.getPattern(), {
            ...(options.global || {}),
            ...(options.actions?.[route.name] || {}),
          })
        })

        return this
      },
    )
  }

  async #devMode() {
    this.#config = this.app.config.get<TuyauConfig>('tuyau')

    const router = await this.app.container.make('router')
    const tsConfigPath = join(fileURLToPath(this.app.appRoot), './tsconfig.json')

    const openApiPath = this.#config.openapi?.paths?.spec ?? '/openapi'
    router.get(openApiPath, async () => {
      const project = new tsMorph.Project({
        manipulationSettings: { quoteKind: tsMorph.QuoteKind.Single },
        tsConfigFilePath: tsConfigPath,
      })

      const footprintString = typeFootprint('.adonisjs/api.ts', 'ApiDefinition', {
        tsConfigFilePath: tsConfigPath,
      })

      const footprint = project.createSourceFile('.adonisjs/__footprint.ts', footprintString, {
        overwrite: true,
      })
      const apiDefinition = footprint.getInterfaceOrThrow('ApiDefinition')
      const yaml = new OpenApiGenerator(apiDefinition, this.#config, this.#metaStore).generate()

      return yaml
    })
  }

  async boot() {
    const router = await this.app.container.make('router')

    this.#devMode()

    const uiPath = this.#config.openapi?.paths?.ui ?? '/docs'

    router.get(uiPath, async ({}) => {
      console.log(this.#config.openapi?.provider)
      if (this.#config.openapi?.provider === 'scalar' || !this.#config.openapi?.provider) {
        return scalarRenderer('/openapi', this.#config.openapi?.scalar || {})
      }

      return swaggerUiRenderer('/openapi', this.#config.openapi.swagger || {})
    })
  }
}
