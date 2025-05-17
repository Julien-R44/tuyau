import { IsNever, Prettify } from '@tuyau/utils/types'
import {
  type TuyauClient,
  type GeneratedRoutes,
  QueryParameters,
  createTuyauRecursiveProxy,
} from '@tuyau/client'
import {
  DefinedInitialDataOptions,
  QueryClient,
  queryOptions,
  skipToken,
  SkipToken,
  UndefinedInitialDataOptions,
} from '@tanstack/react-query'

export function createTuyauReactQueryClient<
  D extends Record<string, any>,
  R extends GeneratedRoutes,
>(options: { client: TuyauClient<D, R>; queryClient: QueryClient }) {
  return createTuyauRecursiveProxy(({ args, executeIfRouteParamCall, paths }) => {
    const fnName = paths.at(-1)
    const path = paths.slice(0, -1)
    const [arg1, arg2] = args

    if (fnName === 'queryOptions') {
      return tuyauQueryOptions({
        input: arg1,
        opts: arg2,
        queryKey: getQueryKeyInternal(path, arg1, 'query'),
        queryClient: options.queryClient,
        client: options.client as any,
        path,
      })
    }
  }) as TuyauReactQuery<D>
}

function getQueryKeyInternal(path: string[], input?: unknown, type?: QueryType): TuyauQueryKey {
  const splitPath = path.flatMap((part) => part.split('/'))

  return [
    splitPath,
    {
      ...(typeof input !== 'undefined' && input !== skipToken && { input }),
      ...(type && type !== 'any' && { type }),
    },
  ]
}

function tuyauQueryOptions(options: {
  input: unknown
  opts: any
  queryKey: TuyauQueryKey
  queryClient: QueryClient
  path: string[]
  client: TuyauClient<any, any>
}) {
  const { input, opts, queryKey } = options
  const inputIsSkipToken = input === skipToken

  return queryOptions({
    ...opts,
    queryKey,
    queryFn: inputIsSkipToken
      ? skipToken
      : async (ctx) => {
          return await options.client.$fetch({ paths: options.path })
        },
  })
}

type UnionFromSuccessStatuses<Res extends Record<number, unknown>> = Res[Extract<
  keyof Res,
  200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
>]
export type EndpointDef = {
  request: Record<string, unknown>
  response: Record<number, unknown>
}

/**
 * @public
 */
export type QueryType = 'any' | 'infinite' | 'query'

/**
 * @public
 */
export type TuyauQueryKey = [
  readonly string[],
  { input?: unknown; type?: Exclude<QueryType, 'any'> }?,
]

/**
 * @public
 */
export type TuyauMutationKey = [readonly string[]]

type ReservedOptions = 'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'

/**
 * Cookies, headers and params can be present in the request.
 * See https://docs.adonisjs.com/guides/basics/validation#validating-cookies-headers-and-route-params
 *
 * So they must be excluded from the query options. This helper does that.
 */
type CleanRequest<Request> = Request extends { cookies?: any; headers?: any; params?: any }
  ? Omit<Request, 'cookies' | 'headers' | 'params'>
  : Request

export type TuyauReactQuery<in out Route extends Record<string, any>> = {
  [K in keyof Route as K extends `:${string}` ? never : K]: Route[K] extends {
    response: infer Res extends Record<number, unknown>
    request: infer Request
  }
    ? // GET, HEAD
      K extends '$get' | '$head'
      ? DecorateQueryProcedure<Route[K]>
      : // POST, PUT, PATCH, DELETE
        DecorateMutationProcedure
    : K extends '$url'
      ? (options?: { query?: QueryParameters }) => string
      : CreateParams<Route[K]>
}

/**
 * Omits the key without removing a potential union
 * @internal
 */
export type DistributiveOmit<TObj, TKey extends keyof any> = TObj extends any
  ? Omit<TObj, TKey>
  : never

export type CreateParams<Route extends Record<string, any>> =
  Extract<keyof Route, `:${string}`> extends infer Path extends string
    ? IsNever<Path> extends true
      ? Prettify<TuyauReactQuery<Route>> & DecorateRouterKeyable
      : ((params: {
          [param in Path extends `:${infer Param}` ? Param : never]: string | number
        }) => Prettify<TuyauReactQuery<Route[Path]>> & CreateParams<Route[Path]>) &
          Prettify<TuyauReactQuery<Route>>
    : never

interface DefinedTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends DistributiveOmit<
    DefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
    ReservedOptions
  > {}

interface UndefinedTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends DistributiveOmit<
    UndefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
    ReservedOptions
  > {}

export interface TuyauReactQueryOptions<EDef extends EndpointDef> {
  // Without initial data
  <TQueryFnData extends EDef['response'], TData = TQueryFnData>(
    input: EDef['request'] | SkipToken,
    opts?: UndefinedTuyauQueryOptionsIn<TQueryFnData, TData, any>,
  ): UndefinedInitialDataOptions<UnionFromSuccessStatuses<TQueryFnData>, TData>
  // With initial data
  <TQueryFnData extends EDef['response'], TData = TQueryFnData>(
    input: EDef['request'] | SkipToken,
    opts: DefinedTuyauQueryOptionsIn<UnionFromSuccessStatuses<TQueryFnData>, TData, any>,
  ): DefinedInitialDataOptions<UnionFromSuccessStatuses<TQueryFnData>, TData>
}

export interface DecorateQueryProcedure<EDef extends EndpointDef> {
  queryOptions: TuyauReactQueryOptions<EDef>
  queryKey: () => string[]
}

export interface DecorateMutationProcedure {
  mutationOptions: any
  mutationKey: () => string[]
}

export interface DecorateRouterKeyable {
  pathKey: () => string[]
}
