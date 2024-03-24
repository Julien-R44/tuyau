type JsonPrimitive = string | number | boolean | string | number | boolean | null

type NonJsonPrimitive = undefined | Function | symbol

type IsAny<T> = 0 extends 1 & T ? true : false

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
    : T extends JsonPrimitive
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
                    ? SerializeObject<T>
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
