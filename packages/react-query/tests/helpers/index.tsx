import { getActiveTest } from '@japa/runner'
import React, { PropsWithChildren } from 'react'
import { renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
