
import { SendEmail } from '@/data/interfaces/send-email'
import { clientEmail } from './client-email'

import nodemailer from 'nodemailer'

export namespace NodeMailerAdapter {
  export type Params = {
    auth: {
      user: string,
      password: string
    },
    host: string,
    port: number,
    to:string[],
    from:{
      name: string,
      email: string
    },
    subject:string
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
      port: this.paramsInstance.port
    })

    const toJoin = this.paramsInstance.to.reduce((toStr, toItem, index) =>
      (index === 0) ? toItem : `${toStr}, ${toItem}`
    , '')
    const info = await client.sendMail({
      from: `"${this.paramsInstance.from.name}" <${this.paramsInstance.from.email}>`,
      to: toJoin,
      subject: this.paramsInstance.subject,
      text: params.text,
      html: params.text
    })
    console.log('preview: ', nodemailer.getTestMessageUrl(info))
    return info.messageId
  }
}
