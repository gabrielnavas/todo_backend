
import { SendEmail } from '@/data/interfaces/send-email'
import { clientEmail } from './helpers/client-email'

export class NodeMailerAdapter implements SendEmail {
  constructor (
    private auth: {
      user: string,
      pass: string
    },
    private host: string,
    private port: number,
    private readonly from:{
      name: string,
      email: string
    },
    private readonly to:string[],
    private readonly subject:string
  ) {}

  async sendOneEmail (params: SendEmail.Params): Promise<SendEmail.Result> {
    const client = await clientEmail({
      auth: {
        user: this.auth.user,
        password: this.auth.pass
      },
      host: this.host,
      port: this.port
    })

    const toJoin = this.to.reduce((toStr, toItem, index) =>
      (index === 0) ? toItem : `${toStr}, ${toItem}`
    , '')

    const info = await client.sendMail({
      from: `"${this.from.name}" <${this.from.email}>`,
      to: toJoin,
      subject: this.subject,
      text: params.text,
      html: params.text
    })

    return info.messageID
  }
}
