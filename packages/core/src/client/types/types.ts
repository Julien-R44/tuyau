import type { Options as KyOptions } from 'ky'
import type { ClientRouteMatchItTokens } from '@adonisjs/http-server/client/url_builder'

import type { TuyauError } from '../errors.ts'
import type { TuyauPromise } from '../promise.ts'

/**
 * Supported HTTP methods for API endpoints
 */
export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/**
 * Options for the `current` method to match params and/or query
 */
export interface CurrentRouteOptions {
  params?: Record<string, any>
  query?: Record<string, any>
}

/**
 * Base endpoint types structure
 */
export interface EndpointTypes {
  paramsTuple: [...any[]]
  params: Record<
    string,
    string | number | boolean | bigint | (string | number | boolean | bigint)[]
  >
  query: Record<string, any>
  body: unknown
  response: unknown
  errorResponse?: unknown
}

/**
 * Schema endpoint, used in generated registry.schema.d.ts
 * Does not include tokens (only present in runtime routes)
 */
export interface SchemaEndpoint {
  methods: Method[]
  pattern: string
  types: EndpointTypes
}

/**
 * Definition of an AdonisJS endpoint with types and metadata
 * Includes tokens for runtime route building
 */
export interface AdonisEndpoint extends SchemaEndpoint {
  tokens: ClientRouteMatchItTokens[]
}

/**
 * Extract query params from a validator type if it has a 'query' property.
 * Used in generated registry to separate query params from body for POST/PUT/PATCH/DELETE.
 * For GET/HEAD, use ExtractQueryForGet instead.
 */
export type ExtractQuery<T> = 'query' extends keyof T
  ? T extends { query?: infer Q }
    ? Q
    : {}
  : {}

/**
 * Extract query params for GET/HEAD requests.
 * Excludes headers, cookies, and params from the validator type since these are not query params.
 */
export type ExtractQueryForGet<T> = Omit<T, 'headers' | 'cookies' | 'params'>

/**
 * Extract body from a validator type, excluding reserved properties.
 * Excludes 'query', 'params', 'headers', and 'cookies' as these are handled separately by AdonisJS.
 */
export type ExtractBody<T> = Omit<T, 'query' | 'params' | 'headers' | 'cookies'>

/**
 * Success status codes (2xx)
 */
type SuccessStatus = 200 | 201 | 202 | 203 | 204 | 205 | 206

/**
 * Extract the actual response type from a controller return type.
 * - Success responses (2xx): extracts `__response`
 * - Error responses (non-2xx with __response/__status): returns `never` to filter from unions
 * - Plain types (no __status): returns as-is
 */
export type ExtractResponse<T> = T extends { __response: infer R; __status: SuccessStatus }
  ? R
  : T extends { __response: unknown; __status: number }
    ? never
    : T

/**
 * Inverse of ExtractResponse — extracts non-2xx status types as a discriminated union.
 * Each member has `{ status: S; response: R }` for narrowing via `isStatus()`.
 */
export type ExtractErrorResponse<T> = T extends { __response: infer R; __status: infer S }
  ? S extends SuccessStatus
    ? never
    : { status: S; response: R }
  : never

/**
 * Registry mapping endpoint names to their definitions
 */
export interface AdonisRegistry extends Record<string, AdonisEndpoint> {}

export type ValueOf<T> = T[keyof T]

/**
 * Convert a union type to an intersection type
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

/**
 * Structure of a Tuyau registry containing routes and optional tree
 */
export interface TuyauRegistry<
  Routes extends Record<string, AdonisEndpoint> = Record<string, AdonisEndpoint>,
  Tree = unknown,
> {
  routes: Routes
  $tree?: Tree
}

/**
 * Extracts the $tree type from a registry
 * Uses direct access instead of conditional type for performance
 */
export type InferTree<R extends TuyauRegistry> = R['$tree']

/**
 * Extracts the routes from a registry
 */
export type InferRoutes<R extends TuyauRegistry> = R['routes']

export type Endpoints = ValueOf<AdonisRegistry>

export type EndpointByName<Name extends keyof AdonisRegistry & string> = AdonisRegistry[Name]

/**
 * Supported response types for overriding Content-Type based parsing
 */
export type ResponseType = 'json' | 'text' | 'arrayBuffer' | 'blob'

/**
 * Tuyau-specific request options (not part of Ky)
 */
export type TuyauRequestOptions = {
  responseType?: ResponseType
}

/**
 * Pre-computed base Ky options to avoid recomputing Omit on every request
 */
export type BaseRequestOptions = Omit<
  KyOptions,
  'body' | 'params' | 'searchParams' | 'method' | 'json' | 'prefixUrl'
>

/**
 * Helper types for optional/required fields - using literal types instead of mapped types
 */
type ParamsArg<T> = keyof T extends never ? {} : {} extends T ? { params?: T } : { params: T }

type QueryArg<T> = keyof T extends never ? {} : {} extends T ? { query?: T } : { query: T }

type BodyArg<T> = keyof T extends never ? {} : {} extends T ? { body?: T } : { body: T }

/**
 * Request args without ky options
 */
export type RawRequestArgs<E extends SchemaEndpoint> = ParamsArg<E['types']['params']> &
  QueryArg<E['types']['query']> &
  BodyArg<E['types']['body']>

/**
 * Constructs the request arguments type for an endpoint
 */
export type RequestArgs<E extends SchemaEndpoint> = RawRequestArgs<E> &
  BaseRequestOptions &
  TuyauRequestOptions

/**
 * Extracts response type from an endpoint
 */
export type ResponseOf<E extends SchemaEndpoint> = E['types']['response']

/**
 * Extracts error response type from an endpoint
 */
export type ErrorResponseOf<E extends SchemaEndpoint> = E['types'] extends {
  errorResponse: infer ER
}
  ? ER
  : unknown

/**
 * Normalizes the error type to satisfy TuyauError's constraint.
 * Routes without typed errors pass `unknown`, which maps to `{ response: any }`.
 * Always includes a `{ status: number; response: unknown }` fallback so that
 * catch-all blocks after exhaustive `isStatus()` checks never resolve to `never`.
 */
export type NormalizeError<E> =
  | (E extends { response: any } ? E : { response: any })
  | { status: number; response: unknown }

/**
 * Extracts the typed TuyauError contract from an endpoint.
 */
export type ErrorOf<E extends SchemaEndpoint> = TuyauError<NormalizeError<ErrorResponseOf<E>>>

/**
 * Function type for calling an endpoint
 */
export type EndpointFn<E extends SchemaEndpoint> = (
  args: RequestArgs<E>,
) => TuyauPromise<E['types']['response'], ErrorResponseOf<E>>

/**
 * Function type for an endpoint with inlined args
 */
type EndpointFnInline<E extends AdonisEndpoint> = (
  args: ParamsArg<E['types']['params']> &
    QueryArg<E['types']['query']> &
    BodyArg<E['types']['body']> &
    BaseRequestOptions &
    TuyauRequestOptions,
) => TuyauPromise<E['types']['response'], ErrorResponseOf<E>>

/**
 * Transforms a pre-computed ApiDefinition tree into callable endpoint functions
 * This recursively converts each endpoint in the tree to a callable function
 * Handles intersection types where a node is both an endpoint AND has children
 */
export type TransformApiDefinition<T> = {
  [K in keyof T]: T[K] extends AdonisEndpoint
    ? EndpointFnInline<T[K]> & TransformApiDefinition<Omit<T[K], keyof AdonisEndpoint>>
    : TransformApiDefinition<T[K]>
}

/**
 * Filters endpoints by HTTP method
 */
export type EndpointsByMethod<Reg extends Record<string, AdonisEndpoint>, M extends Method> = {
  [K in keyof Reg]: M extends Reg[K]['methods'][number] ? Reg[K] : never
}[keyof Reg]

export type StrKeys<R> = Extract<keyof R, string>

export type RegValues<R> = R[StrKeys<R>]

/**
 * Gets URL patterns for endpoints matching a specific HTTP method
 */
export type PatternsByMethod<
  Reg extends Record<string, AdonisEndpoint>,
  M extends Method,
> = EndpointsByMethod<Reg, M>['pattern']

/**
 * Finds an endpoint by HTTP method and URL pattern
 */
export type EndpointByMethodPattern<
  R extends Record<string, AdonisEndpoint>,
  M extends Method,
  P extends PatternsByMethod<R, M>,
> = FilterByMethodPathForRegistry<R, M, P>

/**
 * Plugin function type for extending Tuyau functionality
 */
export interface TuyauPlugin {
  (params: { options: TuyauConfiguration<any> }): void
}

export type MaybeArray<T> = T | T[]

/**
 * Type for URL query parameters
 */
type QueryParameterPrimitive = string | number | boolean | Date | null | undefined

export interface QueryParameters extends Record<
  string,
  QueryParameterPrimitive | Array<QueryParameterPrimitive | QueryParameters> | QueryParameters
> {}

/**
 * Configuration options for creating a Tuyau client
 */
export interface TuyauConfiguration<T extends TuyauRegistry> extends Omit<
  KyOptions,
  'prefixUrl' | 'body' | 'json' | 'method' | 'searchParams'
> {
  registry: T
  baseUrl: string
  plugins?: TuyauPlugin[]
}

/**
 * Should be augmented by the user to provide their endpoint registry
 * Structure: { routes: Record<string, AdonisEndpoint>, $tree: ApiDefinition }
 */
export interface UserRegistry {}

type UserAdonisRegistry = UserRegistry extends { routes: infer R }
  ? R extends Record<string, AdonisEndpoint>
    ? R
    : Record<string, AdonisEndpoint>
  : Record<string, AdonisEndpoint>

type UserEndpointByName<Name extends keyof UserAdonisRegistry> = UserAdonisRegistry[Name]

type FilterByMethodPathForRegistry<
  Reg extends Record<string, AdonisEndpoint>,
  M extends Method,
  P extends ValueOf<Reg>['pattern'] & string,
> = {
  [K in keyof Reg]: Reg[K]['pattern'] extends P
    ? M extends Reg[K]['methods'][number]
      ? Reg[K]
      : never
    : never
}[keyof Reg]

type EndpointByNameForRegistry<
  Reg extends Record<string, AdonisEndpoint>,
  Name extends keyof Reg,
> = Reg[Name]

/**
 * Internal type utilities for working with endpoints by HTTP method and path pattern
 * Accepts a registry as generic parameter
 */
export namespace PathWithRegistry {
  export type Request<
    Reg extends Record<string, AdonisEndpoint>,
    M extends Method,
    P extends PatternsByMethod<Reg, M>,
  > = RequestArgs<FilterByMethodPathForRegistry<Reg, M, P>>

  export type Response<
    Reg extends Record<string, AdonisEndpoint>,
    M extends Method,
    P extends PatternsByMethod<Reg, M>,
  > = ResponseOf<FilterByMethodPathForRegistry<Reg, M, P>>

  export type Params<
    Reg extends Record<string, AdonisEndpoint>,
    M extends Method,
    P extends PatternsByMethod<Reg, M>,
  > = FilterByMethodPathForRegistry<Reg, M, P>['types']['params']

  export type Body<
    Reg extends Record<string, AdonisEndpoint>,
    M extends Method,
    P extends PatternsByMethod<Reg, M>,
  > = FilterByMethodPathForRegistry<Reg, M, P>['types']['body']

  export type Query<
    Reg extends Record<string, AdonisEndpoint>,
    M extends Method,
    P extends PatternsByMethod<Reg, M>,
  > = FilterByMethodPathForRegistry<Reg, M, P>['types']['query']

  export type Error<
    Reg extends Record<string, AdonisEndpoint>,
    M extends Method,
    P extends PatternsByMethod<Reg, M>,
  > = ErrorOf<FilterByMethodPathForRegistry<Reg, M, P>>
}

/**
 * Internal type utilities for working with endpoints by route name
 * Accepts a registry as generic parameter
 */
export namespace RouteWithRegistry {
  export type Request<
    Reg extends Record<string, AdonisEndpoint>,
    Name extends keyof Reg,
  > = RequestArgs<EndpointByNameForRegistry<Reg, Name>>

  export type Response<
    Reg extends Record<string, AdonisEndpoint>,
    Name extends keyof Reg,
  > = ResponseOf<EndpointByNameForRegistry<Reg, Name>>

  export type Params<
    Reg extends Record<string, AdonisEndpoint>,
    Name extends keyof Reg,
  > = EndpointByNameForRegistry<Reg, Name>['types']['params']

  export type Body<
    Reg extends Record<string, AdonisEndpoint>,
    Name extends keyof Reg,
  > = EndpointByNameForRegistry<Reg, Name>['types']['body']

  export type Query<
    Reg extends Record<string, AdonisEndpoint>,
    Name extends keyof Reg,
  > = EndpointByNameForRegistry<Reg, Name>['types']['query']

  export type Error<
    Reg extends Record<string, AdonisEndpoint>,
    Name extends keyof Reg,
  > = ErrorOf<EndpointByNameForRegistry<Reg, Name>>
}

/**
 * Type utilities for working with endpoints by HTTP method and path pattern
 * Uses the user-augmented registry
 */
export namespace Path {
  export type Request<
    M extends Method,
    P extends PatternsByMethod<UserAdonisRegistry, M>,
  > = RequestArgs<FilterByMethodPathForRegistry<UserAdonisRegistry, M, P>>
  export type Response<
    M extends Method,
    P extends PatternsByMethod<UserAdonisRegistry, M>,
  > = ResponseOf<FilterByMethodPathForRegistry<UserAdonisRegistry, M, P>>
  export type Params<
    M extends Method,
    P extends PatternsByMethod<UserAdonisRegistry, M>,
  > = FilterByMethodPathForRegistry<UserAdonisRegistry, M, P>['types']['params']
  export type Body<
    M extends Method,
    P extends PatternsByMethod<UserAdonisRegistry, M>,
  > = FilterByMethodPathForRegistry<UserAdonisRegistry, M, P>['types']['body']
  export type Query<
    M extends Method,
    P extends PatternsByMethod<UserAdonisRegistry, M>,
  > = FilterByMethodPathForRegistry<UserAdonisRegistry, M, P>['types']['query']
  export type Error<
    M extends Method,
    P extends PatternsByMethod<UserAdonisRegistry, M>,
  > = ErrorOf<FilterByMethodPathForRegistry<UserAdonisRegistry, M, P>>
}

/**
 * Type utilities for working with endpoints by route name
 * Uses the user-augmented registry
 */
export namespace Route {
  export type Request<Name extends keyof UserAdonisRegistry> = RequestArgs<UserEndpointByName<Name>>
  export type Response<Name extends keyof UserAdonisRegistry> = ResponseOf<UserEndpointByName<Name>>
  export type Params<Name extends keyof UserAdonisRegistry> =
    UserEndpointByName<Name>['types']['params']
  export type Body<Name extends keyof UserAdonisRegistry> =
    UserEndpointByName<Name>['types']['body']
  export type Query<Name extends keyof UserAdonisRegistry> =
    UserEndpointByName<Name>['types']['query']
  export type Error<Name extends keyof UserAdonisRegistry> = ErrorOf<UserEndpointByName<Name>>
}

/**
 * Extracts literal status codes from E, filtering out the wide `number` from the fallback.
 * `number extends 404` is false → keep. `number extends number` is true → skip.
 */
export type KnownStatuses<E> = E extends { status: infer S extends number }
  ? number extends S
    ? never
    : S
  : never

type ParamsShape<E> = E extends { types: { paramsTuple: infer PT; params: infer P } }
  ? (PT extends [] ? { paramsTuple?: PT } : { paramsTuple: PT }) &
      (keyof P extends never ? {} : { params: P })
  : never

export type RegistryGroupedByMethod<
  R extends Record<string, AdonisEndpoint>,
  M extends Method = Method,
> = {
  [K in M | 'ALL']: {
    [Route in keyof R as K extends 'ALL'
      ? Route
      : K extends R[Route]['methods'][number]
        ? Route
        : never]: ParamsShape<R[Route]>
  }
}
