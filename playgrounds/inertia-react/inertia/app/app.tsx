import '../css/app.css'

import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@tuyau/inertia/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import { queryClient, tuyau, TuyauQueryProvider } from './tuyau'

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
            <TuyauQueryProvider client={tuyau} queryClient={queryClient}>
              <App {...props} />
            </TuyauQueryProvider>
          </TuyauProvider>
        </QueryClientProvider>
      </>
    )
  },
})
