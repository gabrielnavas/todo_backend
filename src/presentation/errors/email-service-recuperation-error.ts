export class EmailServiceRecuperationError extends Error {
  constructor (msg: string) {
    super(msg)
    this.name = 'EmailInUseError'
  }
}
