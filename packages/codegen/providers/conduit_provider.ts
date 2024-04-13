import type { ApplicationService } from '@adonisjs/core/types'

export default class TuyauProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Registers the lock manager in the application container
   */
  register() {}
}
