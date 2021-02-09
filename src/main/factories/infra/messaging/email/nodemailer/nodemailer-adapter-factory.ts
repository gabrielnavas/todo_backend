import { NodeMailerAdapter } from '@/infra/messaging/email/nodemailer/nodemailer-adapter'
import env from '@/main/configs/env'

export const nodemailerAdapterFactory = () => {
  const paramsNodeMailer = {
    auth: {
      user: env.sendEmailUser,
      password: env.sendEmailPassword
    },
    // host: env.sendEmailHost,
    // port: env.sendEmailPort,
    service: env.sendEmailService,
    from: {
      email: env.sendEmailUser,
      name: env.sendEmailUser.split('@')[0]
    },
    subject: 'recuperate your password'
  } as NodeMailerAdapter.Params
  return new NodeMailerAdapter(paramsNodeMailer)
}
