export class InvalidUserTokenError extends Error {
  constructor () {
    super('Invalid user token error')
    this.name = 'InvalidUserTokenError'
  }
}
