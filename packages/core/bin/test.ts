import { assert } from '@japa/assert'
import { snapshot } from '@japa/snapshot'
import { fileSystem } from '@japa/file-system'
import { expectTypeOf } from '@japa/expect-type'
import { processCLIArgs, configure, run } from '@japa/runner'
import { setup as setupAttest, teardown as teardownAttest } from '@arktype/attest'

processCLIArgs(process.argv.slice(2))
configure({
  files: ['tests/**/*.spec.ts'],
  plugins: [assert(), expectTypeOf(), fileSystem({ autoClean: true }), snapshot()],
  setup: [
    () => {
      setupAttest()
      return () => teardownAttest()
    },
  ],
})

run()
