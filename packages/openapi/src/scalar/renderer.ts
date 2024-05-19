import { css } from './css.js'
import type { ReferenceConfiguration } from './types/index.js'

export function scalarRenderer(url: string, config: ReferenceConfiguration) {
  return `
    <!doctype html>
      <html>
        <head>
          <title>API Reference</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>${config.customCss || css}</style>
        </head>
        <body>
          <script
            id="api-reference"
            data-url="${url}"
            data-configuration='${JSON.stringify(config)}'
          >
          </script>
          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
        </body>
      </html>
    `
}
