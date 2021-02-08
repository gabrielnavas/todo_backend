import nodemailer from 'nodemailer'
import { NodeMailerAdapter } from '@/infra/messaging/email/nodemailer/nodemailer-adapter'

jest.setTimeout(30000)

describe('NodeMailerAdapter', () => {
  test('should call nodemailerAdapter with correct params and return a MessageID', async () => {
    const testAccount = await nodemailer.createTestAccount()
    const params = {
      auth: {
        user: testAccount.user,
        password: testAccount.pass
      },
      host: 'smtp.ethereal.email',
      port: 587,
      from: {
        name: 'gabriel',
        email: 'any_email@email.com'
      },
      subject: 'any_tests',
      to: ['votena3613@hancack.com']
    } as NodeMailerAdapter.Params
    const sut = new NodeMailerAdapter(params)
    const messageID = await sut.sendOneEmail({
      html: '<h1>hello young</h1>',
      text: 'hello young'
    })
    expect(messageID).toBeTruthy()
  })
})
