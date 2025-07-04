import { IsNever, Prettify } from '@tuyau/utils/types'
import {
  type TuyauClient,
  type GeneratedRoutes,
  QueryParameters,
  createTuyauRecursiveProxy,
} from '@tuyau/client'
import {
  DataTag,
  DefinedInitialDataOptions,
  MutationFunction,
  QueryClient,
  queryOptions,
  skipToken,
  SkipToken,
  UndefinedInitialDataOptions,
  UseMutationOptions,
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

    if (fnName === 'mutationOptions') {
      return tuyauMutationOptions({
        opts: arg1,
        path,
        queryClient: options.queryClient,
        client: options.client as any,
      })
    }

    if (fnName === 'queryKey') return getQueryKeyInternal(path, arg1, 'query')
    if (fnName === 'pathKey') return getQueryKeyInternal(path)
    if (fnName === 'mutationKey') return getMutationKeyInternal(path)

    const newProxy = executeIfRouteParamCall({ fnName: fnName!, body: args[0] })
    if (newProxy) return newProxy

    throw new Error(`Method ${fnName} not found on Tuyau client`)
  }) as TuyauReactQuery<D> & DecorateRouterKeyable
}

function getQueryKeyInternal(path: string[], input?: unknown, type?: QueryType): TuyauQueryKey {
  const splitPath = path.flatMap((part) => part.toString().split('/'))

  if (!input && (!type || type === 'any')) {
    return splitPath.length ? [splitPath] : ([] as unknown as TuyauQueryKey)
  }

  return [
    splitPath,
    {
      ...(typeof input !== 'undefined' && input !== skipToken && { input }),
      ...(type && type !== 'any' && { type }),
    },
  ]
}

export function getMutationKeyInternal(path: readonly string[]): TuyauMutationKey {
  const splitPath = path.flatMap((part) => part.toString().split('.'))

  return splitPath.length ? [splitPath] : ([] as unknown as TuyauMutationKey)
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
      : async () => {
          // @ts-expect-error tkt
          return await options.client.$fetch({ paths: options.path, input: options.input })
        },
  })
}

function tuyauMutationOptions(options: {
  opts: any
  path: string[]
  queryClient: QueryClient
  client: TuyauClient<any, any>
}) {
  const { opts, path } = options

  const mutationKey = getMutationKeyInternal(path)
  // const defaultOpts = queryClient.defaultMutationOptions(
  //   queryClient.getMutationDefaults(mutationKey),
  // )

  const mutationFn: MutationFunction = async (input) => {
    // @ts-expect-error tkt
    const result = await options.client.$fetch({
      paths: path,
      input,
    })

    return result
  }

  return {
    ...opts,
    mutationKey,
    mutationFn,
  }
}

type UnionFromSuccessStatuses<Res extends Record<number, unknown>> = Res[Extract<
  keyof Res,
  200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
>]
export type EndpointDef = {
  request: Record<string, unknown>
  response: Record<number, unknown>
}

export type QueryType = 'any' | 'infinite' | 'query'

export type TuyauQueryKey = [
  readonly string[],
  { input?: unknown; type?: Exclude<QueryType, 'any'> }?,
]

export type TuyauMutationKey = [readonly string[]]

type QueryReservedOptions = 'queryKey' | 'queryFn' | 'queryHashFn' | 'queryHash'

export type TuyauReactQuery<in out Route extends Record<string, any>> = {
  [K in keyof Route as K extends `:${string}` ? never : K]: Route[K] extends {
    response: infer _Res extends Record<number, unknown>
    request: infer _Request
  }
    ? // GET, HEAD
      K extends '$get' | '$head'
      ? DecorateQueryFn<Route[K]> & DecorateRouterKeyable
      : // POST, PUT, PATCH, DELETE
        DecorateMutationFn<Route[K]> & DecorateRouterKeyable
    : K extends '$url'
      ? (options?: { query?: QueryParameters }) => string
      : CreateParams<Route[K]> & DecorateRouterKeyable
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
    QueryReservedOptions
  > {}

interface UndefinedTuyauQueryOptionsIn<TQueryFnData, TData, TError>
  extends DistributiveOmit<
    UndefinedInitialDataOptions<TQueryFnData, TError, TData, TuyauQueryKey>,
    QueryReservedOptions
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

type MutationReservedOptions = 'mutationKey' | 'mutationFn'

interface TuyauMutationOptionsIn<TInput, TError, TOutput, TContext>
  extends DistributiveOmit<
    UseMutationOptions<TOutput, TError, TInput, TContext>,
    MutationReservedOptions
  > {}

interface TuyauMutationOptionsOut<TInput, TError, TOutput, TContext>
  extends UseMutationOptions<TOutput, TError, TInput, TContext> {
  mutationKey: TuyauMutationKey
}

export interface TuyauReactMutationOptions<TDef extends EndpointDef> {
  <TContext = unknown>(
    opts?: TuyauMutationOptionsIn<
      // TDef['input'],
      TDef['request'],
      any,
      UnionFromSuccessStatuses<TDef['response']>,
      TContext
    >,
  ): TuyauMutationOptionsOut<
    TDef['request'],
    any,
    UnionFromSuccessStatuses<TDef['response']>,
    TContext
  >
}
export interface DecorateQueryFn<EDef extends EndpointDef> {
  queryOptions: TuyauReactQueryOptions<EDef>
  queryKey: (input?: Partial<EDef['request']>) => DataTag<TuyauQueryKey, EDef['response'], any>
}

export interface DecorateMutationFn<EDef extends EndpointDef> {
  mutationOptions: TuyauReactMutationOptions<EDef>
  mutationKey: () => TuyauMutationKey
}

export interface DecorateRouterKeyable {
  pathKey: () => TuyauQueryKey
}
