import { Route } from '@adonisjs/core/http'
import type { ApplicationService } from '@adonisjs/core/types'
import { LazyImport } from '@adonisjs/core/types/http'
import { Constructor } from 'ts-morph'

declare module '@adonisjs/core/http' {
  export interface Router {
    action: <T extends Constructor<any>>(
      pattern: string,
      handler: LazyImport<Constructor<any>>
    ) => Route<T>
  }
}
export default class TuyauProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Registers the lock manager in the application container
   */
  register() {}
}
