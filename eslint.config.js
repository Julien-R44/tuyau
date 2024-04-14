import { join } from 'node:path'
import { julr } from '@julr/tooling-configs/eslint'

export default await julr(
  {
    adonisjs: true,
    enableGitIgnore: {
      files: join(import.meta.dirname, '.gitignore'),
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
