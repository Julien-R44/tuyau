import { Options as KyOptions } from 'ky'
import { ClientRouteMatchItTokens } from '@adonisjs/http-server/client/url_builder'

/**
 * Supported HTTP methods for API endpoints
 */
export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'

/**
 * Definition of an AdonisJS endpoint with types and metadata
 */
export interface AdonisEndpoint {
  methods: Method[]
  pattern: string
  tokens: ClientRouteMatchItTokens[]
  types: {
    paramsTuple: [...any[]]
    params: Record<string, string | number | boolean>
    query: Record<string, any>
    body: unknown
    response: unknown
    errors?: unknown
  }
}

/**
 * Registry mapping endpoint names to their definitions
 */
export type AdonisRegistry = Record<string, AdonisEndpoint>

export type ValueOf<T> = T[keyof T]

type IsEmptyObj<T> = keyof T extends never ? true : false

type IsEmptyTuple<T> = T extends [] ? true : false

export type Endpoints = ValueOf<AdonisRegistry>

export type EndpointByName<Name extends keyof AdonisRegistry & string> = AdonisRegistry[Name]

/**
 * Checks if a type has any keys
 */
export type HasKeys<T> = keyof T extends never ? false : true

/**
 * Checks if a type has required keys (non-optional properties)
 */
export type HasRequiredKeys<T> =
  T extends Record<string, any>
    ? keyof T extends never
      ? false
      : {} extends Pick<T, keyof T>
        ? false
        : true
    : false

/**
 * Constructs the request arguments type for an endpoint
 */
export type RequestArgs<E extends AdonisEndpoint> = (HasKeys<E['types']['params']> extends true
  ? HasRequiredKeys<E['types']['params']> extends true
    ? { params: E['types']['params'] }
    : { params?: E['types']['params'] }
  : {}) &
  (E['types']['query'] extends object
    ? HasRequiredKeys<E['types']['query']> extends true
      ? { query: E['types']['query'] }
      : { query?: E['types']['query'] }
    : {}) &
  (E['types']['body'] extends never | undefined
    ? {}
    : HasRequiredKeys<E['types']['body']> extends true
      ? { body: E['types']['body'] }
      : { body?: E['types']['body'] }) &
  Omit<KyOptions, 'body' | 'params' | 'searchParams' | 'method' | 'json' | 'prefixUrl'>

/**
 * Extracts response type from an endpoint
 */
export type ResponseOf<E extends AdonisEndpoint> = E['types']['response']

/**
 * Extracts error types from an endpoint
 */
export type ErrorsOf<E extends AdonisEndpoint> = E['types']['errors'] extends undefined
  ? never
  : E['types']['errors']

/**
 * Splits a dot-separated string into an array of strings
 */
export type Split<S extends string> = S extends `${infer H}.${infer T}` ? [H, ...Split<T>] : [S]

/**
 * Converts a union type to an intersection type
 */
export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I,
) => void
  ? I
  : never

/**
 * Builds a nested object type for the fluent API based on endpoint names
 */
export type BuildNamed<Reg extends Record<string, AdonisEndpoint>> = UnionToIntersection<
  {
    [K in keyof Reg & string]: SetAtPath<Split<K>, EndpointFn<Reg[K]>>
  }[keyof Reg & string]
>

/**
 * Sets a value at a specific path in a nested object type
 */
export type SetAtPath<Path extends string[], V> = Path extends [
  infer H extends string,
  ...infer T extends string[],
]
  ? { [K in H]: T['length'] extends 0 ? V : SetAtPath<T, V> }
  : {}

/**
 * Function type for calling an endpoint
 */
type EndpointFn<E extends AdonisEndpoint> = (
  args: RequestArgs<E>,
) => Promise<E['types']['response']>

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
export type TuyauPlugin = (params: { options: TuyauConfiguration<any> }) => void

export type MaybeArray<T> = T | T[]

/**
 * Type for URL query parameters
 */
export type QueryParameters = Record<
  string,
  MaybeArray<string | number | boolean | null | undefined>
>

/**
 * Configuration options for creating a Tuyau client
 */
export type TuyauConfiguration<T extends Record<string, AdonisEndpoint>> = Omit<
  KyOptions,
  'prefixUrl' | 'body' | 'json' | 'method' | 'searchParams'
> & {
  registry: T
  baseUrl: string
  plugins?: TuyauPlugin[]
}

/**
 * Should be augmented by the user to provide their endpoint registry
 */
export interface UserRegistry {}

type UserAdonisRegistry =
  UserRegistry extends Record<string, AdonisEndpoint>
    ? UserRegistry
    : Record<string, AdonisEndpoint>

type UserEndpointByName<Name extends keyof UserAdonisRegistry> = UserAdonisRegistry[Name]

type FilterByMethodPathForRegistry<
  Reg extends Record<string, AdonisEndpoint>,
  M extends Method,
  P extends ValueOf<Reg>['pattern'] & string,
> = {
  [K in keyof Reg]: [Reg[K]['pattern'], M] extends [P, Reg[K]['methods'][number]] ? Reg[K] : never
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

  export type Errors<
    Reg extends Record<string, AdonisEndpoint>,
    M extends Method,
    P extends PatternsByMethod<Reg, M>,
  > = ErrorsOf<FilterByMethodPathForRegistry<Reg, M, P>>

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

  export type Errors<Reg extends Record<string, AdonisEndpoint>, Name extends keyof Reg> = ErrorsOf<
    EndpointByNameForRegistry<Reg, Name>
  >

  export type Body<
    Reg extends Record<string, AdonisEndpoint>,
    Name extends keyof Reg,
  > = EndpointByNameForRegistry<Reg, Name>['types']['body']

  export type Query<
    Reg extends Record<string, AdonisEndpoint>,
    Name extends keyof Reg,
  > = EndpointByNameForRegistry<Reg, Name>['types']['query']
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
  export type Errors<
    M extends Method,
    P extends PatternsByMethod<UserAdonisRegistry, M>,
  > = ErrorsOf<FilterByMethodPathForRegistry<UserAdonisRegistry, M, P>>
  export type Body<
    M extends Method,
    P extends PatternsByMethod<UserAdonisRegistry, M>,
  > = FilterByMethodPathForRegistry<UserAdonisRegistry, M, P>['types']['body']
  export type Query<
    M extends Method,
    P extends PatternsByMethod<UserAdonisRegistry, M>,
  > = FilterByMethodPathForRegistry<UserAdonisRegistry, M, P>['types']['query']
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
  export type Errors<Name extends keyof UserAdonisRegistry> = ErrorsOf<UserEndpointByName<Name>>
  export type Body<Name extends keyof UserAdonisRegistry> =
    UserEndpointByName<Name>['types']['body']
  export type Query<Name extends keyof UserAdonisRegistry> =
    UserEndpointByName<Name>['types']['query']
}

type ParamsShape<E> = E extends { types: { paramsTuple: infer PT; params: infer P } }
  ? (IsEmptyTuple<PT> extends true ? { paramsTuple?: PT } : { paramsTuple: PT }) &
      (IsEmptyObj<P> extends true ? {} : { params: P })
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
