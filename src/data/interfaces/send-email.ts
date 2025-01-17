export interface SendEmail {
  sendOneEmail(params: SendEmail.Params): Promise<SendEmail.Result>
}

export namespace SendEmail {
  export type Params = {
    text: string,
    html: string,
    to:string[],
  }

  export type Result = {
    idMessageSend: string
  }
}
