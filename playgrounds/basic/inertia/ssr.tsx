import { ReactElement } from 'react'
import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

import Layout from '~/layouts/default'
import { Data } from '~/generated/data'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      return resolvePageComponent(
        `./pages/${name}.tsx`,
        import.meta.glob('./pages/**/*.tsx', { eager: true }),
        (page: ReactElement<Data.SharedProps>) => <Layout children={page} />,
      )
    },
    setup: ({ App, props }) => {
      return <App {...props} />
    },
  })
}
