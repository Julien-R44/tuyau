import type { RouteJSON } from '@adonisjs/core/types/http'

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

export type FilterConfig<FilterType> = XOR<{ only: FilterType }, { except: FilterType }>

export interface TuyauConfig {
  codegen?: {
    /**
     * Filters the definitions to be generated
     */
    definitions?: FilterConfig<Array<string | RegExp> | ((route: RouteJSON) => boolean)>

    /**
     * Filters the named routes to be generated
     */
    routes?: FilterConfig<Array<string | RegExp> | ((route: RouteJSON) => boolean)>
  }
}
