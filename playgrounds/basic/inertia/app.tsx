import './css/app.css'

import { ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import { queryClient } from './tuyau'
import Layout from '~/layouts/default'
import { Data } from '~/generated/data'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      (page: ReactElement<Data.SharedProps>) => <Layout children={page} />,
    )
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
