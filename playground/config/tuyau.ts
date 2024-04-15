import { defineConfig } from '@tuyau/core'

const tuyauConfig = defineConfig({
  codegen: {
    /**
     * List of routes to ignore during code generation
     */
    ignoreRoutes: (route) => {
      return route.pattern.includes('/backoffice')
    },
  },
})

export default tuyauConfig
