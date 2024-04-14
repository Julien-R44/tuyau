export class TuyauHTTPError extends Error {
  constructor(
    public status: number,
    public value: unknown,
  ) {
    super(value + '')
    this.name = 'TuyauHTTPError'
    this.value = value
  }
}
