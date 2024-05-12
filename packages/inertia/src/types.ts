import type { GeneratedRoutes } from '@tuyau/client'

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
