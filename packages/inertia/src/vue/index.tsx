import { defineComponent, h, inject } from 'vue'
import type { DefineSetupFnComponent } from 'vue'
import { Link as InertiaLink } from '@inertiajs/vue3'
import type { RouteName, RoutesNameParams, TuyauClient } from '@tuyau/client'

import type { AssertedApi } from '../types.js'

export const TUYAU_PLUGIN = 'TUYAU_PLUGIN'

export function getClientKey(key?: string) {
  const suffix = key ? `:${key}` : ''
  return `${TUYAU_PLUGIN}${suffix}`
}

export const TuyauPlugin = {
  install: (app: any, options: { client: TuyauClient<any, any> }) => {
    app.provide(getClientKey(), options.client)
  },
}

/**
 * We need to do weird things here to make it work. If defining the component the standard way,
 * Typescript will resolve the generic and replace it with a `never` at build time. So
 * kind of unusable.
 */
type LinkComponentType<T extends RouteName<AssertedApi['routes']>> = DefineSetupFnComponent<{
  route: T
  params: any
}>

// @ts-expect-error fine
export const Link: <T extends RouteName<AssertedApi['routes']>>(props: {
  route: T
  params: RoutesNameParams<AssertedApi['routes'], T>
}) => LinkComponentType<T> = defineComponent(
  // @ts-expect-error fine
  <T extends RouteName<AssertedApi['routes']>>(props: { route: T; params: any }, ctx) => {
    const tuyau = inject<TuyauClient<any, any> | null>(getClientKey())
    if (!tuyau) throw new Error('You must install the TuyauPlugin before using Link')

    const route = tuyau.$route(props.route, props.params)

    return () => h(InertiaLink, { href: route.path, method: route.method[0], ...props }, ctx.slots)
  },
  { props: ['route', 'params'] },
)
