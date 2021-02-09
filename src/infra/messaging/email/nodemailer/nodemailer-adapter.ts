
import { SendEmail } from '@/data/interfaces/send-email'
import { clientEmail } from './client-email'

export namespace NodeMailerAdapter {
  export type Params = {
    auth: {
      user: string,
      password: string
    },
    host?: string,
    port?: number,

    from:{
      name: string,
      email: string
    },
    subject:string
    service?: string
  }
}

export class NodeMailerAdapter implements SendEmail {
  constructor (
    private readonly paramsInstance: NodeMailerAdapter.Params
  ) {}

  async sendOneEmail (params: SendEmail.Params): Promise<SendEmail.Result> {
    const client = await clientEmail({
      auth: {
        user: this.paramsInstance.auth.user,
        password: this.paramsInstance.auth.password
      },
      host: this.paramsInstance.host,
      port: this.paramsInstance.port,
      service: this.paramsInstance.service
    })

    const toJoin = params.to.reduce((toStr, toItem, index) =>
      (index === 0) ? toItem : `${toStr}, ${toItem}`
    , '')
    const paramsSendEmail = {
      from: `"${this.paramsInstance.from.name}" <${this.paramsInstance.from.email}>`,
      to: toJoin,
      subject: this.paramsInstance.subject,
      text: params.text,
      html: params.html
    }
    const info = await client.sendMail(paramsSendEmail)
    return info.messageId
  }
}
