import { getActiveTest } from '@japa/runner'

import type { DeepPartial } from '../src/types.js'

export function setWindow(window: DeepPartial<Window>) {
  const test = getActiveTest()
  if (!test) throw new Error('No active test found')

  // @ts-expect-error expected
  globalThis.window = {
    ...globalThis.window,
    ...window,
  }

  test.cleanup(() => {
    // @ts-expect-error expected
    globalThis.window = undefined
  })
}
