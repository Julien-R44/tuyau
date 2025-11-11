import { skipToken } from '@tanstack/react-query'

import { Fn } from './types/utils.ts'
import { QueryType, TuyauQueryKey } from './types/common.ts'

/**
 * Check if value is an object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Just call the function.
 */
export function invoke(fn: undefined): undefined
export function invoke<T>(fn: Fn<T>): T
export function invoke<T>(fn?: Fn<T>): T {
  return fn?.() as T
}

export function buildKey(opts: {
  segments: string[]
  request?: unknown
  type: QueryType
}): TuyauQueryKey {
  const { segments, request, type } = opts
  const splitPath = segments.flatMap((part) => part.split('.'))

  if (!request && type === 'any') {
    return splitPath.length ? [splitPath] : ([] as unknown as TuyauQueryKey)
  }

  if (
    type === 'infinite' &&
    isObject(request) &&
    ('direction' in request || 'cursor' in request) // todo fix should be in request.body or query
  ) {
    const { cursor: _, direction: __, ...inputWithoutCursorAndDirection } = request
    return [splitPath, { request: inputWithoutCursorAndDirection, type: 'infinite' }]
  }

  return [
    splitPath,
    {
      ...(typeof request !== 'undefined' && request !== skipToken && { request: request as any }),
      ...(type && type !== 'any' && { type }),
    },
  ]
}
