import { skipToken } from '@tanstack/query-core'

import type { Fn, QueryType, TuyauQueryKey, TuyauRequestOptions } from './types.ts'

/**
 * Type guard that checks if a value is a plain object
 * (not null, not an array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Immediately invokes a function and returns its result.
 * Used to create query/mutation functions inline with
 * proper skip token handling
 */
export function invoke(fn: undefined): undefined
export function invoke<T>(fn: Fn<T>): T
export function invoke<T>(fn?: Fn<T>): T {
  return fn?.() as T
}

/**
 * Builds a structured TanStack Query key from route segments,
 * request arguments, and query type.
 *
 * For infinite queries, automatically strips `cursor` and `direction`
 * from query/body params to ensure stable cache keys across pages
 */
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
 * Extracts Ky-compatible HTTP options from Tuyau request options,
 * filtering out Tuyau-specific properties like `abortOnUnmount`
 */
export function extractKyOptions(
  tuyauOpts?: TuyauRequestOptions,
): Omit<TuyauRequestOptions, 'abortOnUnmount'> {
  if (!tuyauOpts) return {}

  const { abortOnUnmount, ...kyOptions } = tuyauOpts
  return kyOptions
}
