import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import inertia from '@adonisjs/inertia/client'
import { getDirname } from '@adonisjs/core/helpers'

export default defineConfig({
  plugins: [
    // @ts-expect-error tkt
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.ts' } }),
    vue(),
    adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
})
