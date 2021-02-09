import { RemoteCommunicateUserTemporaryNewPassword } from '@/data/usecases/remote-communicate-user-temporary-new-password'
import { BcryptAdapter } from '@/infra/cryptography'
import { UserTemporaryPasswordPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-temporary-password'
import { NodeMailerAdapter } from '@/infra/messaging/email/nodemailer/nodemailer-adapter'
import { FakerAdapter } from '@/infra/random-data'
import { nodemailerAdapterFactory } from '../infra/messaging/email/nodemailer/nodemailer-adapter-factory'

export const remoteCommunicateUserTemporaryNewPasswordFactory = () => {
  const maxLengthPassword = 8
  const createPasswordRandom = new FakerAdapter()
  const salt = 12
  const createHasherPassword = new BcryptAdapter(salt)
  const insertOnePasswordTemporaryByEmail = new UserTemporaryPasswordPostgreSQLRepository()
  const sendEmail = nodemailerAdapterFactory()
  return new RemoteCommunicateUserTemporaryNewPassword(
    maxLengthPassword,
    createPasswordRandom,
    createHasherPassword,
    insertOnePasswordTemporaryByEmail,
    sendEmail
  )
}
