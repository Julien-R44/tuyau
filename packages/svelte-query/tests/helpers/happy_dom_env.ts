import { GlobalRegistrator } from '@happy-dom/global-registrator'
import type { Environment } from 'vitest/runtime'

export class HappyDom {
  static init() {
    const httpGlobals = {
      fetch,
      Request,
      Response,
      Headers,
      FormData,
      Blob,
      File,
      AbortController,
      AbortSignal,
      ReadableStream,
      WritableStream,
      TransformStream,
    }

    GlobalRegistrator.register({
      url: 'http://localhost:3000',
      width: 1920,
      height: 1080,
    })

    // Keep Node's HTTP globals so Nock can intercept requests without mixing body types.
    Object.assign(globalThis, httpGlobals)
  }

  static destroy() {
    return GlobalRegistrator.unregister()
  }
}

export default {
  name: 'happy-dom-node-fetch',
  viteEnvironment: 'client',
  setup() {
    HappyDom.init()
    return { teardown: () => HappyDom.destroy() }
  },
} satisfies Environment
