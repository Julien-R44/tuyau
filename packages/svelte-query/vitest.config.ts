import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  test: {
    include: ['tests/integration/**/*.svelte.test.ts'],
    environment: 'happy-dom',
  },
})
