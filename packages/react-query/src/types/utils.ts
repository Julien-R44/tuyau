export type Fn<Result = void, Args extends unknown[] = unknown[]> = (...args: Args) => Result

/**
 * Omits the key without removing a potential union
 */
export type DistributiveOmit<TObj, TKey extends keyof any> = TObj extends any
  ? Omit<TObj, TKey>
  : never

/**
 * Make certain keys required in a type
 */
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>
