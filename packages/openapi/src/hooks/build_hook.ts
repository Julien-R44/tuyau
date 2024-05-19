import type { AssemblerHookHandler } from '@adonisjs/core/types/app'

export default async function viteBuildHook({ logger }: Parameters<AssemblerHookHandler>[0]) {
  logger.info('building Open API schema...')
}
