import type { Options as KyOptions } from 'ky'
import type { Simplify, Serialize, IsNever, Prettify } from '@tuyau/utils/types'

/**
 * Shape of the response returned by Tuyau
 */
export type TuyauResponse<Res extends Record<number, unknown>> =
  | {
      error: null
      status: number
      response: Response
      data: Res[200] extends Simplify<Serialize<infer Response>> ? Response : never
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
              value: Res[Status] extends Simplify<Serialize<infer Response>> ? Response : never
            }
          }[Exclude<keyof Res, 200>]
    }

/**
 * Expose the response if awaited or the unwrap method that will return the data or throw an error
 */
export type ResponseOrUnwrap<Res extends Record<number, unknown>> = Promise<TuyauResponse<Res>> & {
  unwrap: () => Promise<Res[200]>
}

/**
 * Shape of the Adonis Client. This is a recursive type that generate
 * all nested calls like `api.users({ id: 'foo' }).get()` and so on.
 *
 * The real implementation of this type is done with a Proxy object
 */
export type AdonisClient<in out Route extends Record<string, any>> = {
  [K in keyof Route as K extends `:${string}` ? never : K]: Route[K] extends {
    response: infer Res extends Record<number, unknown>
    request: infer Request
  }
    ? K extends '$get' | '$head'
      ? unknown extends Request
        ? (options?: TuyauQueryOptions & { query?: Request }) => ResponseOrUnwrap<Res>
        : {} extends Request
          ? (options?: TuyauQueryOptions & { query?: Request }) => ResponseOrUnwrap<Res>
          : (options: TuyauQueryOptions & { query: Request }) => ResponseOrUnwrap<Res>
      : {} extends Request
        ? (body?: Request | null, options?: TuyauQueryOptions) => ResponseOrUnwrap<Res>
        : (body: Request, options?: TuyauQueryOptions) => ResponseOrUnwrap<Res>
    : K extends '$url'
      ? () => string
      : CreateParams<Route[K]>
}

export type CreateParams<Route extends Record<string, any>> =
  Extract<keyof Route, `:${string}`> extends infer Path extends string
    ? IsNever<Path> extends true
      ? Prettify<AdonisClient<Route>>
      : ((params: {
          [param in Path extends `:${infer Param}` ? Param : never]: string | number
        }) => Prettify<AdonisClient<Route[Path]>> & CreateParams<Route[Path]>) &
          Prettify<AdonisClient<Route>>
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
 * Options accepted by Tuyau
 */
export type TuyauOptions<T extends ApiDefinition> = {
  baseUrl: string
  api?: T
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

type MultipleFormatsParams<T extends readonly string[]> = T extends readonly []
  ? undefined
  :
      | { [K in keyof T]: string | number }
      | {
          [K in CamelCase<T[number]>]: string | number
        }

export type RouteUrlParams<T extends GeneratedRoutes, RouteName extends T[number]['name']> =
  MultipleFormatsParams<RoutesNameParams<T, RouteName>> extends undefined
    ? { query?: QueryParameters }
    : { query?: QueryParameters; params: MultipleFormatsParams<RoutesNameParams<T, RouteName>> }

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
}

/**
 * ------------------------------------------------------------
 * Helpers for infering types from AdonisAPI
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
