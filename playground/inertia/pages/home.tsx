import { tuyau } from '~/app/tuyau'
import { Match, Switch, createResource } from 'solid-js'
import type { InferPageProps } from '@adonisjs/inertia/types'

import type InertiaController from '../../app/controllers/inertia_controller'

type InferErrorType<T extends (...args: any) => any> = Awaited<ReturnType<T>>['error']

export default function Home(props: InferPageProps<InertiaController, 'index'>) {
  const [data] = createResource(async () => {
    const result = await tuyau.users.get()
    if (result.error) throw result.error

    return result.data
  })

  const errorMessage = () => {
    const error = data.error as InferErrorType<typeof tuyau.users.get>

    if (error?.status === 400) {
      return error.value.message
    }

    if (error?.status === 502) {
      return error.value
    }

    return 'Unknown error'
  }

  return (
    <>
      <div class="container">
        <div class="title">AdonisJS {props.version} x Inertia x Solid.js</div>

        <Switch>
          <Match when={data.loading}>Loading...</Match>
          <Match when={data.error}>{errorMessage()}</Match>
          <Match when={data()}>
            {(users) => <ul>{users()?.users.map((user) => <li>{user.name}</li>)}</ul>}
          </Match>
        </Switch>
      </div>
    </>
  )
}
