import React from 'react'
import { Link as InertiaLink } from '@inertiajs/react'
import type { TuyauClient, RouteName } from '@tuyau/client'

import type { AssertedApi, LinkParams } from '../types.js'

const TuyauContext = React.createContext<TuyauClient<any, any> | null>(null)

export const TuyauProvider = (props: {
  children: React.ReactNode
  client: TuyauClient<any, any>
}) => <TuyauContext.Provider value={props.client}>{props.children}</TuyauContext.Provider>

export const useTuyau = () => React.useContext(TuyauContext)

type LinkProps<Route extends RouteName<AssertedApi['routes']>> = Omit<
  React.ComponentPropsWithoutRef<typeof InertiaLink>,
  'href' | 'method'
> &
  LinkParams<Route>

function LinkInner<Route extends RouteName<AssertedApi['routes']>>(
  props: LinkProps<Route>,
  ref?: React.ForwardedRef<React.ElementRef<typeof InertiaLink>>,
) {
  const tuyau = useTuyau()
  if (!tuyau) throw new Error('You must wrap your app in a TuyauProvider')

  const route = tuyau.$route(props.route, (props as any).params)
  return <InertiaLink {...props} href={route.path} method={route.method[0]} ref={ref} />
}

export const Link: <Route extends RouteName<AssertedApi['routes']>>(
  props: LinkProps<Route> & {
    ref?: React.Ref<React.ElementRef<typeof InertiaLink>>
  },
) => ReturnType<typeof LinkInner> = React.forwardRef(LinkInner) as any
