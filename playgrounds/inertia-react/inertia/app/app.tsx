import '../css/app.css'

import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@tuyau/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import { tuyau } from './tuyau'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'))
  },

  setup({ el, App, props }) {
    hydrateRoot(
      el,
      <>
        <TuyauProvider client={tuyau}>
          <App {...props} />
        </TuyauProvider>
      </>
    )
  },
})
