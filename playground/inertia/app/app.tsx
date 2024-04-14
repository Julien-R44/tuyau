import '../css/app.css'
import { hydrate } from 'solid-js/web';
import { createInertiaApp } from 'inertia-adapter-solid'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

createInertiaApp({
  progress: { color: '#5468FF' },
  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {
    hydrate(() => <App {...props} />, el)
  },
})
