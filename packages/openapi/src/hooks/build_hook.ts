import util from 'node:util'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { exec as cpExec } from 'node:child_process'
import type { AssemblerHookHandler } from '@adonisjs/core/types/app'

const exec = util.promisify(cpExec)

export default async function tuyauBuildHook({ logger }: Parameters<AssemblerHookHandler>[0]) {
  logger.info('generating open api file', { suffix: 'tuyau' })

  if (!existsSync('./build/.adonisjs/openapi.yaml')) {
    await mkdir('./build/.adonisjs', { recursive: true })
  }

  const { stderr } = await exec(
    'node ace tuyau:generate:openapi --destination=./build/.adonisjs/openapi.yaml',
  )

  if (stderr) throw new Error(stderr)
}
