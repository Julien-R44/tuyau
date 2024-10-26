import React from 'react'
import { Link as InertiaLink } from '@inertiajs/react'
import type { TuyauClient, RouteName, GeneratedRoutes } from '@tuyau/client'

import type { ValidatedApi, LinkParams } from '../types.js'

const TuyauContext = React.createContext<TuyauClient<any, any> | null>(null)

export function TuyauProvider<D extends Record<string, any>, R extends GeneratedRoutes>(props: {
  children: React.ReactNode
  client: TuyauClient<D, R>
}) {
  // @ts-expect-error fine
  return <TuyauContext.Provider value={props.client}>{props.children}</TuyauContext.Provider>
}

export const useTuyau = () => React.useContext(TuyauContext)

type LinkProps<Route extends RouteName<ValidatedApi['routes']>> = Omit<
  React.ComponentPropsWithoutRef<typeof InertiaLink>,
  'href' | 'method'
> &
  LinkParams<Route>

function LinkInner<Route extends RouteName<ValidatedApi['routes']>>(
  props: LinkProps<Route>,
  ref?: React.ForwardedRef<React.ElementRef<typeof InertiaLink>>,
) {
  const tuyau = useTuyau()
  if (!tuyau) throw new Error('You must wrap your app in a TuyauProvider')

  const route = tuyau.$route(props.route, (props as any).params)
  const url = tuyau.$url(props.route, { params: props.params } as any)

  return (
    <InertiaLink
      {...props}
      route={undefined}
      params={undefined}
      href={url}
      method={route.method[0]}
      ref={ref}
    />
  )
}

export const Link: <Route extends RouteName<ValidatedApi['routes']>>(
  props: LinkProps<Route> & {
    ref?: React.Ref<React.ElementRef<typeof InertiaLink>>
  },
  // @ts-expect-error TODO: fix this
) => ReturnType<typeof LinkInner> = React.forwardRef(LinkInner) as any
