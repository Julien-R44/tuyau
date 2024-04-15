import type { RouteJSON } from '@adonisjs/core/types/http'

export interface TuyauConfig {
  codegen?: {
    /**
     * List of routes to ignore during code generation
     */
    ignoreRoutes?: Array<string | RegExp>[] | ((route: RouteJSON) => boolean)
  }
}
