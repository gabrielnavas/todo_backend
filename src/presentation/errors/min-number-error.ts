export class MinNumberError extends Error {
  constructor (paramName: string, min: number) {
    super(`${paramName} number must be greater than ${min}`)
    this.name = 'NegativeOrZeroValueError'
  }
}
