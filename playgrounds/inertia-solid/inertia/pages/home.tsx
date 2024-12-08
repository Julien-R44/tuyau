import type { InferErrorType } from '@tuyau/client'
import type { InferPageProps } from '@adonisjs/inertia/types'
import { Match, Show, Switch, createResource, createSignal } from 'solid-js'

import { tuyau } from '~/app/tuyau'
import type InertiaController from '../../app/controllers/inertia_controller.js'

export default function Home(props: InferPageProps<InertiaController, 'index'>) {
  const [file, setFile] = createSignal<File | null>(null)
  const [data] = createResource(async () => {
    const result = await tuyau.users.$get({ query: { limit: 10 } })
    if (result.error) throw result.error

    return result.data
  })

  const errorMessage = () => {
    const error = data.error as InferErrorType<typeof tuyau.users.get>

    /**
     * We can narrow down the error.value type based on the status code
     */
    if (error?.status === 400) return error.value.message
    if (error?.status === 502) return error.value

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

        <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        <Show when={file()}>
          <div>
            <div>File Name: {file()?.name}</div>
            <div>File Size: {file()?.size}</div>
          </div>
        </Show>

        <button
          onClick={async () => {
            const text = await tuyau['simple-text'].$get()
            console.log(text.data === 'foo')

            const result = await tuyau['file-upload'].$post({
              file: file()!,
            })

            if (result.error) throw result.error
          }}
        >
          Upload File
        </button>
      </div>
    </>
  )
}
