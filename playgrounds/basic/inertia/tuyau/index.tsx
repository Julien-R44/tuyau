import React from 'react'
import type { Tuyau } from '@tuyau/core/client'
import type { UserRegistry, AdonisRegistry } from '@tuyau/core/types'
import { Link as InertiaLink, router as InertiaRouter } from '@inertiajs/react'

const TuyauContext = React.createContext<Tuyau<any> | null>(null)

export type LinkParams<Route extends keyof UserRegistry> = {
  route: Route
} & (UserRegistry[Route]['types']['params'] extends Record<string, never>
  ? { params?: never }
  : {} extends UserRegistry[Route]['types']['params']
    ? { params?: UserRegistry[Route]['types']['params'] }
    : { params: UserRegistry[Route]['types']['params'] })

export function TuyauProvider<R extends AdonisRegistry>(props: {
  children: React.ReactNode
  client: Tuyau<R>
}) {
  return <TuyauContext.Provider value={props.client}>{props.children}</TuyauContext.Provider>
}

export const useTuyau = () => React.useContext(TuyauContext)

type LinkProps<Route extends keyof UserRegistry> = Omit<
  React.ComponentPropsWithoutRef<typeof InertiaLink>,
  'href' | 'method'
> &
  LinkParams<Route>

function LinkInner<Route extends keyof UserRegistry>(
  props: LinkProps<Route>,
  ref?: React.ForwardedRef<React.ElementRef<typeof InertiaLink>>
) {
  const tuyau = useTuyau()
  if (!tuyau) throw new Error('You must wrap your app in a TuyauProvider')

  const routeInfo = tuyau.getRoute(props.route, { params: props.params })

  const { route, params, ...linkProps } = props

  return (
    <InertiaLink
      {...linkProps}
      href={routeInfo.url}
      method={routeInfo.methods[0].toLowerCase() as any}
      ref={ref}
    />
  )
}

export const Link: <Route extends keyof UserRegistry>(
  props: LinkProps<Route> & {
    ref?: React.Ref<React.ElementRef<typeof InertiaLink>>
  }
) => ReturnType<typeof LinkInner> = React.forwardRef(LinkInner) as any

export function useRouter() {
  const tuyau = useTuyau()
  if (!tuyau) throw new Error('You must wrap your app in a TuyauProvider')

  const router = {
    visit: <Route extends keyof UserRegistry>(
      props: LinkParams<Route>,
      options?: Parameters<typeof InertiaRouter.visit>[1]
    ) => {
      const routeInfo = tuyau.getRoute(props.route, { params: props.params })
      const url = routeInfo.url

      return InertiaRouter.visit(url, {
        ...options,
        method: routeInfo.methods[0].toLowerCase() as any,
      })
    },
  }

  return router
}
