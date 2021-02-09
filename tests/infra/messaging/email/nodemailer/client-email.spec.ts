import nodemailer from 'nodemailer'

import { clientEmail } from '@/infra/messaging/email/nodemailer/client-email'

jest.setTimeout(30000)

describe('clientEmail - nodemailer', () => {
  test('should instance is true', async () => {
    const testAccount = await nodemailer.createTestAccount()
    const client = clientEmail({
      auth: {
        user: String(testAccount.user),
        password: String(testAccount.pass)
      },
      host: 'smtp.ethereal.email',
      port: 587
    })
    expect(client).toBeTruthy()
  })
})
