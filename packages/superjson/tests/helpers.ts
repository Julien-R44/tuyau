import { getActiveTest } from '@japa/runner'
import { createServer, IncomingMessage, ServerResponse } from 'node:http'

/**
 * Create a http server that will be closed automatically
 * when the test ends
 */
export const httpServer = {
  create(callback: (req: IncomingMessage, res: ServerResponse) => any) {
    const server = createServer(callback)
    getActiveTest()?.cleanup(async () => {
      await new Promise<void>((resolve) => {
        server.close(() => resolve())
      })
    })

    return server
  },
}
