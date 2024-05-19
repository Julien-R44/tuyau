import { defineConfig } from '@tuyau/core'

const tuyauConfig = defineConfig({
  openapi: {
    provider: 'scalar',

    documentation: {
      info: {
        title: 'My Super AdonisJS API !!',
        contact: { name: 'Jujujul', email: 'jul@gmail.com', url: 'https://adonisjs.com' },
        version: '1.0.0',
        description: 'This is a sample OpenAPI documentation for AdonisJS',
      },
      tags: [
        {
          name: 'me',
          description: 'Operations about connected user',
        },
      ],
    },
  },
})

export default tuyauConfig
