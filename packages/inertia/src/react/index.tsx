import React from 'react'
import { Link as InertiaLink } from '@inertiajs/react'
import type { TuyauClient, RouteName, RoutesNameParams } from '@tuyau/client'

import type { AssertedApi } from '../types.js'

const TuyauContext = React.createContext<TuyauClient<any, any> | null>(null)

export const TuyauProvider = (props: {
  children: React.ReactNode
  client: TuyauClient<any, any>
}) => <TuyauContext.Provider value={props.client}>{props.children}</TuyauContext.Provider>

export const useTuyau = () => React.useContext(TuyauContext)

type LinkProps<Route extends RouteName<AssertedApi['routes']>> = Omit<
  React.ComponentPropsWithoutRef<typeof InertiaLink>,
  'href' | 'method'
> & {
  route: Route
  params: RoutesNameParams<AssertedApi['routes'], Route>
}

function LinkInner<Route extends RouteName<AssertedApi['routes']>>(
  props: LinkProps<Route>,
  ref?: React.ForwardedRef<React.ElementRef<typeof InertiaLink>>,
) {
  const tuyau = useTuyau()
  if (!tuyau) throw new Error('You must wrap your app in a TuyauProvider')

  const result = tuyau.$route(props.route, props.params as any)

  console.log(result)

  return <InertiaLink {...props} href={result.path} method={result.method[0]} ref={ref} />
}

export const Link: <Route extends RouteName<AssertedApi['routes']>>(
  props: LinkProps<Route> & {
    ref?: React.Ref<React.ElementRef<typeof InertiaLink>>
  },
) => ReturnType<typeof LinkInner> = React.forwardRef(LinkInner) as any
