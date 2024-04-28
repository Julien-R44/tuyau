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
type ResponseOrUnwrap<Res extends Record<number, unknown>> = Promise<TuyauResponse<Res>> & {
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
    ? K extends 'get' | 'head'
      ? unknown extends Request
        ? (options?: TuyauOptions & { query?: Request }) => ResponseOrUnwrap<Res>
        : {} extends Request
          ? (options?: TuyauOptions & { query?: Request }) => ResponseOrUnwrap<Res>
          : (options: TuyauOptions & { query: Request }) => ResponseOrUnwrap<Res>
      : {} extends Request
        ? (body?: Request | null, options?: TuyauOptions) => ResponseOrUnwrap<Res>
        : (body: Request, options?: TuyauOptions) => ResponseOrUnwrap<Res>
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

/**
 * Options accepted by Tuyau
 */
export type TuyauOptions = Omit<
  KyOptions,
  'prefixUrl' | 'body' | 'json' | 'method' | 'searchParams'
>

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
