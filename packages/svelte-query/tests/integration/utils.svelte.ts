import { QueryClient } from '@tanstack/query-core'
import { flushSync } from 'svelte'

export function withEffectRoot(fn: () => void | Promise<void>) {
  return async () => {
    let promise: void | Promise<void> = Promise.resolve()
    const cleanup = $effect.root(() => {
      promise = fn()
    })
    await promise
    cleanup()
  }
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
}

/**
 * Wait for nock-intercepted requests to resolve and Svelte reactive state to update.
 * Uses real setTimeout (not fake timers) since nock uses the real async pipeline.
 */
export async function settle(ms = 100) {
  await new Promise((resolve) => setTimeout(resolve, ms))
  flushSync()
}
