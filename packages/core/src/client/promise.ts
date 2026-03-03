import { TuyauError } from './errors.ts'

/**
 * Normalizes the error type to satisfy TuyauError's constraint.
 * Routes without typed errors pass `unknown`, which maps to `{ response: any }`.
 * Always includes a `{ status: number; response: unknown }` fallback so that
 * catch-all blocks after exhaustive `isStatus()` checks never resolve to `never`.
 */
type NormalizeError<E> =
  | (E extends { response: any } ? E : { response: any })
  | { status: number; response: unknown }

/**
 * A promise wrapper that adds `.safe()` for non-throwing error handling.
 * Implements PromiseLike so `await` works transparently.
 */
export class TuyauPromise<Data, Errors = unknown> implements PromiseLike<Data> {
  #promise: Promise<Data>

  constructor(promise: Promise<Data>) {
    this.#promise = promise
  }

  then<R1 = Data, R2 = never>(
    onfulfilled?: ((value: Data) => R1 | PromiseLike<R1>) | null,
    onrejected?: ((reason: any) => R2 | PromiseLike<R2>) | null,
  ): Promise<R1 | R2> {
    return this.#promise.then(onfulfilled, onrejected)
  }

  catch<R = never>(onrejected?: ((reason: any) => R | PromiseLike<R>) | null): Promise<Data | R> {
    return this.#promise.catch(onrejected)
  }

  finally(onfinally?: (() => void) | null): Promise<Data> {
    return this.#promise.finally(onfinally)
  }

  /**
   * Returns a tuple instead of throwing on error.
   * - On success: `[data, null]`
   * - On error: `[null, TuyauError]`
   */
  safe(): Promise<
    [data: Data, error: null] | [data: null, error: TuyauError<NormalizeError<Errors>>]
  > {
    return this.#promise.then(
      (data) => [data, null] as [Data, null],
      (error) =>
        [null, error as TuyauError<NormalizeError<Errors>>] as [
          null,
          TuyauError<NormalizeError<Errors>>,
        ],
    )
  }
}
