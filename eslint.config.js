import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { julr } from '@julr/tooling-configs/eslint'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export default await julr(
  {
    adonisjs: true,
    enableGitIgnore: {
      files: join(dirname, '.gitignore'),
      root: true,
      strict: true,
    },
  },
  {
    rules: {
      '@typescript-eslint/ban-types': 'off',
    },
  },
)
