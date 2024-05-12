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

export type AssertedApi = Api extends {
  routes: GeneratedRoutes
  definition: Record<string, any>
}
  ? Api
  : never

/**
 * Params for the Link component
 */
export type LinkParams<T extends RouteName<AssertedApi['routes']>> =
  MultipleFormatsParams<RoutesNameParams<AssertedApi['routes'], T>> extends undefined
    ? { route: T; params?: [] }
    : { route: T; params: MultipleFormatsParams<RoutesNameParams<AssertedApi['routes'], T>> }
