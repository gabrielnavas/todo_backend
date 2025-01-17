import nodemailer from 'nodemailer'

type Params = {
  host?: string,
  port?: number,
  auth: {
    user: string,
    password: string
  },
  service?: string
}

export const clientEmail = (params: Params) => {
  const client = nodemailer.createTransport({
    host: params.host,
    port: params.port,
    secure: false,
    auth: {
      user: params.auth.user,
      pass: params.auth.password
    },
    service: params.service
  })
  return client
}
