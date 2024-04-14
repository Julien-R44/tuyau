/*
|--------------------------------------------------------------------------
| VSCode grammars
|--------------------------------------------------------------------------
|
| Export any custom VSCode languages from this file that you want to
| use inside markdown codeblocks.
|
*/

import { fileURLToPath } from 'node:url'
import type { ILanguageRegistration } from '@dimerapp/shiki'

export default [
  {
    path: fileURLToPath(new URL('./dotenv.tmLanguage.json', import.meta.url)),
    scopeName: 'source.env',
    id: 'dotenv',
  },
] satisfies ILanguageRegistration[]
