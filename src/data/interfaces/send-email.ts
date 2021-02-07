export interface SendEmail {
  sendOneEmail(params: SendEmail.Params): Promise<SendEmail.Result>
}

export namespace SendEmail {
  export type Params = {
    userName: string,
    passwordTemporary: string
  }

  export type Result = Error
}
