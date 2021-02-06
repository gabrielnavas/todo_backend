import { UserAccountModel } from '@/domain/models/user-account'
import { CommunicateUserTemporaryNewPassword } from '@/domain/usecases/communicate-user-temporary-password'

export class RemoteCommunicateUserTemporaryNewPassword
implements CommunicateUserTemporaryNewPassword {
  constructor (
    // private readonly createPasswordRandom: CreatePasswordRandom,
    // private readonly insertOnePasswordTemporaryByEmail: InsertOnePasswordTemporaryByEmailRepository,
    // private readonly sendEmail: SendEmail
  ) {}

  async handle (userAccount: UserAccountModel): Promise<void> {
    // const maxLengthPassword = 8
    // const passwordRandom = this.createPasswordRandom.handle(maxLengthPassword)
    // await this.insertOnePasswordTemporaryByEmail.insertOne(passwordRandom)
    // const paramsEmail = this.makeEmailParams(email)
    // await this.sendEmail.sendOneEmail(paramsEmail)
  }

  // private makeEmailparams(userAccount: UserAccountModel) {
  //   const nameUpperCase =
  //     userAccount.name.toUpperCase()[0] +
  //     userAccount.name.split('').splice(1)
  //   return {
  //     from: 'no-reply@todolist.com',
  //     to: [userAccount.email],
  //     subject: 'Your temporary password',
  //     text: `Hello ${}`,
  //     html: '<h1>any_html</h1>'
  //   } as SendEmail.Params
  // }
}
