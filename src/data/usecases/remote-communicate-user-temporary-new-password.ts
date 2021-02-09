import { UserAccountModel } from '@/domain/models/user-account'
import {
  CommunicateUserTemporaryNewPassword
} from '@/domain/usecases/communicate-user-temporary-password'
import {
  CreatePasswordRandom
} from '@/data/interfaces/create-password-random'
import {
  InsertOnePasswordTemporaryByEmailRepository
} from '@/data/interfaces/insert-one-password-temporary-by-email-repository'
import { SendEmail } from '../interfaces/send-email'
import { Hasher } from '../interfaces'

export class RemoteCommunicateUserTemporaryNewPassword
implements CommunicateUserTemporaryNewPassword {
  constructor (
    private readonly maxLengthPassword: number,
    private readonly createPasswordRandom: CreatePasswordRandom,
    private readonly createHasherPassword: Hasher,
    private readonly insertOnePasswordTemporaryByEmail: InsertOnePasswordTemporaryByEmailRepository,
    private readonly sendEmail: SendEmail
  ) {}

  async handle (userAccount: UserAccountModel): Promise<void> {
    const passwordCreated = await this.createPasswordRandom
      .createPasswordRandomWithLength(this.maxLengthPassword)
    const passwordHashed = await this.createHasherPassword
      .hash(passwordCreated)
    await this.insertOnePasswordTemporaryByEmail.insertOne({
      idUser: userAccount.id,
      passwordTemporary: passwordHashed
    })
    const paramsSendEmail = this.makeSendEmailparams(userAccount, passwordCreated)
    await this.sendEmail.sendOneEmail(paramsSendEmail)
  }

  private makeSendEmailparams (
    userAccount: Pick<UserAccountModel, 'name' | 'email'>,
    passwordTemporary: string) {
    const nameUpperCase = userAccount.name.toUpperCase()[0] +
      userAccount.name.split('').splice(1).join('')
    return {
      to: [userAccount.email],
      text: `Hello ${nameUpperCase}.`,
      html: `
        <h1>Hello ${nameUpperCase}</h1>
        This is your a new temporary password: <strong>${passwordTemporary}</strong>
      `
    } as SendEmail.Params
  }
}
