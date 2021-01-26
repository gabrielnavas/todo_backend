export class NegativeOrZeroValueError extends Error {
  constructor (paramName: string) {
    super(`Negative or zero value error: ${paramName}`)
    this.name = 'NegativeOrZeroValueError'
  }
}
