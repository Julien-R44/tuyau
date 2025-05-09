import type { Options as KyOptions } from 'ky'
import type { IsNever, Prettify } from '@tuyau/utils/types'

import type { RouteHelper } from './route.js'

/**
 * Create an union type from all response that are successful
 */
type UnionFromSuccessStatuses<Res extends Record<number, unknown>> = Res[Extract<
  keyof Res,
  200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
>]

/**
 * Shape of the response returned by Tuyau
 */
export type TuyauResponse<Res extends Record<number, unknown>> =
  | {
      error: null
      status: number
      response: Response
      data: UnionFromSuccessStatuses<Res>
    }
  | {
      data: null
      status: number
      response: Response
      error: Exclude<keyof Res, 200> extends never
        ? { status: unknown; value: unknown }
        : {
            [Status in Exclude<keyof Res, 200>]: {
              status: Status
              value: Res[Status]
            }
          }[Exclude<keyof Res, 200>]
    }

/**
 * Expose the response if awaited or the unwrap method that will return the data or throw an error
 */
export type ResponseOrUnwrap<Res extends Record<number, unknown>> = Promise<TuyauResponse<Res>> & {
  unwrap: () => Promise<UnionFromSuccessStatuses<Res>>
}

/**
 * Cookies, headers and params can be present in the request.
 * See https://docs.adonisjs.com/guides/basics/validation#validating-cookies-headers-and-route-params
 *
 * So they must be excluded from the query options. This helper does that.
 */
type CleanRequest<Request> = Request extends { cookies?: any; headers?: any; params?: any }
  ? Omit<Request, 'cookies' | 'headers' | 'params'>
  : Request

/**
 * Shape of the Adonis Client. This is a recursive type that generate
 * all nested calls like `api.users({ id: 'foo' }).get()` and so on.
 *
 * The real implementation of this type is done with a Proxy object
 */
export type TuyauRpcClient<in out Route extends Record<string, any>> = {
  [K in keyof Route as K extends `:${string}` ? never : K]: Route[K] extends {
    response: infer Res extends Record<number, unknown>
    request: infer Request
  }
    ? // GET, HEAD
      K extends '$get' | '$head'
      ? unknown extends Request
        ? (options?: TuyauQueryOptions & { query?: Request }) => ResponseOrUnwrap<Res>
        : {} extends CleanRequest<Request>
          ? (
              options?: TuyauQueryOptions & { query?: CleanRequest<Request> },
            ) => ResponseOrUnwrap<Res>
          : (options: TuyauQueryOptions & { query: CleanRequest<Request> }) => ResponseOrUnwrap<Res>
      : // POST, PUT, PATCH, DELETE
        {} extends CleanRequest<Request>
        ? (body?: Request | null, options?: TuyauQueryOptions) => ResponseOrUnwrap<Res>
        : (body: CleanRequest<Request>, options?: TuyauQueryOptions) => ResponseOrUnwrap<Res>
    : K extends '$url'
      ? (options?: { query?: QueryParameters }) => string
      : CreateParams<Route[K]>
}

export type CreateParams<Route extends Record<string, any>> =
  Extract<keyof Route, `:${string}`> extends infer Path extends string
    ? IsNever<Path> extends true
      ? Prettify<TuyauRpcClient<Route>>
      : ((params: {
          [param in Path extends `:${infer Param}` ? Param : never]: string | number
        }) => Prettify<TuyauRpcClient<Route[Path]>> & CreateParams<Route[Path]>) &
          Prettify<TuyauRpcClient<Route>>
    : never

export type GeneratedRoutes = readonly {
  params: readonly string[]
  name: string
  path: string
  method: readonly string[]
  types?: { request: any; response: Record<number, unknown> } | unknown
}[]

export type ApiDefinition = {
  routes?: GeneratedRoutes
  definition: Record<string, any>
}

/**
 * Plugin accepted by Tuyau
 */
export type TuyauPlugin = (params: { options: TuyauOptions<any> }) => void

/**
 * Options accepted by Tuyau
 */
export type TuyauOptions<T extends ApiDefinition> = {
  baseUrl: string
  api?: T
  plugins?: TuyauPlugin[]
} & TuyauQueryOptions

export type TuyauQueryOptions = Omit<
  KyOptions,
  'prefixUrl' | 'body' | 'json' | 'method' | 'searchParams'
> & { query?: QueryParameters }

export type QueryParameters = Record<
  string,
  MaybeArray<string | number | boolean | null | undefined>
>

/**
 * ------------------------------------------------------------
 * Types for the $route and related methods
 * ------------------------------------------------------------
 */

export type RouteName<T extends GeneratedRoutes> = T[number]['name']

export type RouteByName<T extends GeneratedRoutes, K extends T[number]['name']> = Extract<
  T[number],
  { name: K }
>

export type RoutesNameParams<
  T extends GeneratedRoutes,
  K extends T[number]['name'],
> = K extends T[number]['name'] ? Extract<T[number], { name: K }>['params'] : never

/**
 * Represents the parameters for multiple formats.
 */
export type MultipleFormatsParams<
  T extends readonly string[],
  OnlyObject = false,
> = T extends readonly []
  ? undefined
  : OnlyObject extends true
    ? { [K in CamelCase<T[number]>]: string | number }
    : { [K in keyof T]: string | number } | { [K in CamelCase<T[number]>]: string | number }

export type RouteUrlParams<
  T extends GeneratedRoutes,
  RouteName extends T[number]['name'],
  OnlyObject = false,
> =
  MultipleFormatsParams<RoutesNameParams<T, RouteName>> extends undefined
    ? { query?: QueryParameters }
    : {
        query?: QueryParameters
        params: MultipleFormatsParams<RoutesNameParams<T, RouteName>, OnlyObject>
      }

export type RouteReturnType<T extends GeneratedRoutes, K extends T[number]['name']> = {
  [Method in RouteByName<T, K>['method'][number] as `$${Lowercase<Method>}`]: RouteByName<
    T,
    K
  >['types'] extends {
    request: infer Req
    response: infer res extends Record<number, unknown>
  }
    ? Method extends 'GET' | 'HEAD'
      ? Req extends undefined
        ? (options?: TuyauQueryOptions) => ResponseOrUnwrap<res>
        : {} extends Req
          ? (options?: TuyauQueryOptions & { query?: Req }) => ResponseOrUnwrap<res>
          : (options: TuyauQueryOptions & { query: Req }) => ResponseOrUnwrap<res>
      : Req extends undefined
        ? (body?: null, options?: TuyauQueryOptions) => ResponseOrUnwrap<res>
        : {} extends Req
          ? (body?: Req, options?: TuyauQueryOptions) => ResponseOrUnwrap<res>
          : (body: Req, options?: TuyauQueryOptions) => ResponseOrUnwrap<res>
    : (body?: unknown, options?: TuyauQueryOptions) => Promise<unknown>
} & {
  params: RouteByName<T, K>['params']
  method: RouteByName<T, K>['method']
  name: RouteByName<T, K>['name']
  path: RouteByName<T, K>['path']
}

/**
 * ------------------------------------------------------------
 * Helpers for infering types from ApiDefinition
 * ------------------------------------------------------------
 */

/**
 * Infer the error type from a Tuyau call
 * @example
 * type Error = InferErrorType<typeof tuyau.users.get>
 */
export type InferErrorType<T extends (...args: any) => any> = Awaited<ReturnType<T>>['error']

/**
 * Infer the response type from a Tuyau call
 * @example
 * type Response = InferResponseType<typeof tuyau.users.get>
 */
export type InferResponseType<T extends (...args: any) => any> = NonNullable<
  Awaited<ReturnType<T>>['data']
>

/**
 * Infer the request type from a Tuyau call
 * @example
 * type Request = InferRequestType<typeof tuyau.users.get>
 */
export type InferRequestType<T extends (...args: any) => any> = Parameters<T>[0] extends {
  query: infer Query
}
  ? Query
  : Parameters<T>[0]

/**
 * ------------------------------------------------------------
 * Utility types
 * ------------------------------------------------------------
 */

/**
 * CamelCase a string
 */
export type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
  : S

/**
 * Array or not of T
 */
type MaybeArray<T> = T | T[]

/**
 * DeepPartial type
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

export type TuyauClient<
  Definition extends Record<string, any>,
  Routes extends GeneratedRoutes,
> = RouteHelper<Routes> & TuyauRpcClient<Definition>
