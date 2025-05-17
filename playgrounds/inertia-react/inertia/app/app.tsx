import '../css/app.css'

import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@tuyau/inertia/react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import { queryClient, tuyau } from './tuyau'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },

  setup({ el, App, props }) {
    createRoot(el).render(
      <>
        <QueryClientProvider client={queryClient}>
          <TuyauProvider client={tuyau}>
            <App {...props} />
          </TuyauProvider>
        </QueryClientProvider>
      </>
    )
  },
})
