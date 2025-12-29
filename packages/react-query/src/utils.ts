import { skipToken } from '@tanstack/react-query'

import type { Fn } from './types/utils.ts'
import type { QueryType, TuyauQueryKey, TuyauReactRequestOptions } from './types/common.ts'

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

  if (type === 'infinite' && isObject(request)) {
    const query = request.query as Record<string, unknown> | undefined
    const body = request.body as Record<string, unknown> | undefined

    const hasCursorInQuery = isObject(query) && ('direction' in query || 'cursor' in query)
    const hasCursorInBody = isObject(body) && ('direction' in body || 'cursor' in body)

    if (hasCursorInQuery || hasCursorInBody) {
      const cleanedRequest: Record<string, unknown> = { ...request }

      if (hasCursorInQuery && isObject(query)) {
        const { cursor: _, direction: __, ...cleanQuery } = query
        cleanedRequest.query = cleanQuery
      }

      if (hasCursorInBody && isObject(body)) {
        const { cursor: _, direction: __, ...cleanBody } = body
        cleanedRequest.body = cleanBody
      }

      return [splitPath, { request: cleanedRequest, type: 'infinite' }]
    }
  }

  return [
    splitPath,
    {
      ...(typeof request !== 'undefined' && request !== skipToken && { request: request as any }),
      ...(type && type !== 'any' && { type }),
    },
  ]
}

/**
 * Extract Ky options from TuyauReactRequestOptions.
 * Removes tuyau-specific options like abortOnUnmount.
 */
export function extractKyOptions(
  tuyauOpts?: TuyauReactRequestOptions,
): Omit<TuyauReactRequestOptions, 'abortOnUnmount'> {
  if (!tuyauOpts) return {}

  const { abortOnUnmount, ...kyOptions } = tuyauOpts
  return kyOptions
}
