import type {
  GeneratedRoutes,
  MultipleFormatsParams,
  RouteName,
  RoutesNameParams,
} from '@tuyau/client'

/**
 * To be extended user-side with module augmentation
 */
export interface Api {}

/**
 * Represents a validated API object
 */
export type ValidatedApi = Api extends {
  routes: infer Routes extends GeneratedRoutes
  definition: infer Definition extends Record<string, any>
}
  ? { routes: Routes; definition: Definition }
  : never

/**
 * Params for the Link component
 */
export type LinkParams<T extends RouteName<ValidatedApi['routes']>> =
  MultipleFormatsParams<RoutesNameParams<ValidatedApi['routes'], T>> extends undefined
    ? { route: T; params?: [] }
    : { route: T; params: MultipleFormatsParams<RoutesNameParams<ValidatedApi['routes'], T>> }
