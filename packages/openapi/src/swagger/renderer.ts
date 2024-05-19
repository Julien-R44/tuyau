import type { SwaggerUIOptions } from './types.js'

export const swaggerUiRenderer = (url: string, options: SwaggerUIOptions) => {
  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.9/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.9/swagger-ui-standalone-preset.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.9/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: "${url}",
              dom_id: '#swagger-ui',
              openapi: "3.1.0",
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset,
              ],
              plugins: [
                SwaggerUIBundle.plugins.DownloadUrl,
              ],
              layout: "StandaloneLayout",
              ...${JSON.stringify(options)},
            });
          };
        </script>
    </body>
  </html>`
}
