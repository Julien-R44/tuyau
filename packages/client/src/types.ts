import type { Options as KyOptions } from 'ky'
import { Simplify, Serialize, IsNever, Prettify } from '@conduit/codegen/types'

/**
 * Shape of the response returned by Conduit
 */
export type ConduitResponse<Res> =
  | { data: Res; error: null; response: Response; status: number }
  | { data: null; error: { message: string }; response: Response; status: number }

/**
 * Shape of the Adonis Client. This is a recursive type that generate
 * all nested calls like `api.users({ id: 'foo' }).get()` and so on.
 *
 * The real implementation of this type is done with a Proxy object
 */
export type AdonisClient<in out Route extends Record<string, any>> = {
  [K in keyof Route as K extends `:${string}` ? never : K]: Route[K] extends {
    response: Simplify<Serialize<infer Res>>
    request: infer Request
  }
    ? K extends 'get' | 'head'
      ? unknown extends Request // If request is not typed
        ? (options?: ConduitOptions & { query?: Request }) => Promise<ConduitResponse<Res>>
        : (options: ConduitOptions & { query: Request }) => Promise<ConduitResponse<Res>>
      : (body: Request, options?: ConduitOptions) => Promise<ConduitResponse<Res>>
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
 * Options accepted by Conduit
 */
export type ConduitOptions = Omit<
  KyOptions,
  'prefixUrl' | 'body' | 'json' | 'method' | 'searchParams'
>
