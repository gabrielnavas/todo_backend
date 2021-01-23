export class UnexpectedError extends Error {
  constructor () {
    super('UnexpectedError')
    this.name = 'UnexpectedError'
  }
}
