import util from 'node:util'
import { exec as cpExec } from 'node:child_process'
import type { AssemblerHookHandler } from '@adonisjs/core/types/app'

const exec = util.promisify(cpExec)

export default async function tuyauBuildHook({ logger }: Parameters<AssemblerHookHandler>[0]) {
  logger.info('generating tuyau codegen file', { suffix: 'tuyau' })

  const { stderr } = await exec('node ace tuyau:generate')

  if (stderr) throw new Error(stderr)
}
