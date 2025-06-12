import type { MultipartFile } from '@adonisjs/bodyparser/types'

type JsonPrimitive = string | number | boolean | string | number | boolean | null

type NonJsonPrimitive = undefined | Function | symbol

type IsAny<T> = 0 extends 1 & T ? true : false

type ReactNativeFile = { uri: string; type: string; name: string }

type FilterKeys<TObj extends object, TFilter> = {
  [TKey in keyof TObj]: TObj[TKey] extends TFilter ? TKey : never
}[keyof TObj]

/**
 * Convert a type to a JSON-serialized version of itself
 *
 * This is useful when sending data from client to server, as it ensure the
 * resulting type will match what the client will receive after JSON serialization.
 */
export type Serialize<T> =
  IsAny<T> extends true
    ? any
    : T extends JsonPrimitive | undefined
      ? T
      : T extends Map<any, any> | Set<any>
        ? Record<string, never>
        : T extends NonJsonPrimitive
          ? never
          : T extends { toJSON(): infer U }
            ? U
            : T extends []
              ? []
              : T extends [unknown, ...unknown[]]
                ? SerializeTuple<T>
                : T extends ReadonlyArray<infer U>
                  ? (U extends NonJsonPrimitive ? null : Serialize<U>)[]
                  : T extends object
                    ? T extends { [key: string]: JsonPrimitive }
                      ? T
                      : SerializeObject<T>
                    : never

/** JSON serialize [tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) */
type SerializeTuple<T extends [unknown, ...unknown[]]> = {
  [k in keyof T]: T[k] extends NonJsonPrimitive ? null : Serialize<T[k]>
}

/** JSON serialize objects (not including arrays) and classes */
type SerializeObject<T extends object> = {
  [k in keyof Omit<T, FilterKeys<T, NonJsonPrimitive>>]: Serialize<T[k]>
}

/**
 * @see https://github.com/ianstormtaylor/superstruct/blob/7973400cd04d8ad92bbdc2b6f35acbfb3c934079/src/utils.ts#L323-L325
 */
export type Simplify<TType> = TType extends any[] | Date
  ? TType
  : { [K in keyof TType]: Simplify<TType[K]> }

export type IsNever<T> = [T] extends [never] ? true : false

/**
 * https://www.totaltypescript.com/concepts/the-prettify-helper
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * Convert a Controller Return Type to a Record of status/response
 *
 * @example
 * type Response = { __status: 200, __response: { foo: string } } | { __status: 400, __response: { error: string } }
 * type ResponseRecord = ConvertReturnTypeToRecordStatusResponse<Response>
 * // ^? { 200: { foo: string }, 400: { error: string } }
 */
export type ConvertReturnTypeToRecordStatusResponse<T> = {
  [P in T as P extends { __status: infer S extends number } ? S : 200]: P extends {
    __response: infer R
  }
    ? R
    : P
}

type UndefinedProps<T extends object> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K]
}

/**
 * Make all undefined properties optional in an object
 *
 * @example
 * type Foo = { a: string, b: number | undefined, c: boolean }
 * type Bar = MakeOptional<Foo> // { a: string, b?: number, c: boolean }
 */
export type MakeOptional<T extends object> = UndefinedProps<T> & Omit<T, keyof UndefinedProps<T>>

/**
 * Shortcut for computing the Tuyau response type
 */
export type MakeTuyauResponse<
  T extends (...args: any) => any,
  HasSchema extends boolean = false,
> = Simplify<Serialize<ConvertReturnTypeToRecordStatusResponse<Awaited<ReturnType<T>>>>> &
  (HasSchema extends true
    ? { 422: { errors: { message: string; rule: string; field: string }[] } }
    : {})

/**
 * Same as MakeTuyauResponse, but without type-level serialization.
 * Used when @tuyau/superjson is installed.
 */
export type MakeNonSerializedTuyauResponse<
  T extends (...args: any) => any,
  HasSchema extends boolean = false,
> = ConvertReturnTypeToRecordStatusResponse<Awaited<ReturnType<T>>> &
  (HasSchema extends true
    ? { 422: { errors: { message: string; rule: string; field: string }[] } }
    : {})

/**
 * Shortcut for computing the Tuyau request type
 *
 * Also Remap MultipartFile to Blob | File | ReactNativeFile
 */
export type MakeTuyauRequest<T extends object> = MakeOptional<{
  [K in keyof T]: T[K] extends MultipartFile ? Blob | File | ReactNativeFile : T[K]
}>
