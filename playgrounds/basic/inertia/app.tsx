import './css/app.css'

import { createRoot } from 'react-dom/client'
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import { queryClient } from './tuyau'
import Layout from '~/layouts/default'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: async (name) => {
    const page = await resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob<{ default: ResolvedComponent }>('./pages/**/*.tsx'),
      Layout,
    )
    return page.default
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <QueryClientProvider client={queryClient}>
        <App {...props} />
      </QueryClientProvider>,
    )
  },
  progress: {
    color: '#4B5563',
  },
})
