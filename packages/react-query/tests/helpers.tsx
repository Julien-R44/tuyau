import { getActiveTest } from '@japa/runner'
import React, { PropsWithChildren } from 'react'
import { renderHook } from '@testing-library/react'
import { Serialize, Simplify } from '@tuyau/utils/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export type ApiDefinition = {
  routes: []
  definition: {
    auth: {
      login: {
        $post: {
          request: { email: string; password: string }
          response: {
            200: Simplify<Serialize<{ token: string }>>
          }
        }
      }
    }
    users: {
      '$get': {
        request: { name: string | null }
        response: {
          200: Simplify<Serialize<{ id: number; name: string }[]>>
        }
      }
      '$post': {
        request: { name: string }
        response: { 201: Simplify<Serialize<{ id: number; name: string }>> }
      }
      ':id': {
        $get: {
          request: {}
          response: { 200: Simplify<Serialize<{ id: number; name: string }>> }
        }
        comments: {
          '$get': {
            request: {}
            response: {
              200: Simplify<Serialize<{ id: number; name: string }[]>>
            }
          }
          ':comment_id': {
            $get: {
              request: {}
              response: {
                200: Simplify<Serialize<{ id: number; name: string }>>
              }
            }
          }
        }
      }
    }
  }
}

export const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

export function renderHookWithWrapper<T>(callback: () => T) {
  const result = renderHook(callback, { wrapper })

  const test = getActiveTest()
  if (!test) throw new Error('No active test found')

  test.cleanup(() => result.unmount())

  return result
}
