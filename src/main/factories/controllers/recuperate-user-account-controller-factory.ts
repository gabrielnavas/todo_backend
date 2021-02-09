
import { RecuperateUserAccountController } from '@/presentation/controllers/recuperate-user-account'
import { Controller } from '@/presentation/interfaces'
import { remoteCommunicateUserTemporaryNewPasswordFactory } from '../data/communicate-user-temporary-new-password-factory'
import { dbLoadUserAccountByEmailFactory } from '../data/db-load-user-account-by-email'
import { recuperateUserAccountValidationFactory } from './recuperate-user-account-validation-factory'

export const recuperateUserAccountControllerFactory = (): Controller => {
  const validation = recuperateUserAccountValidationFactory()
  const findUserAccountByEmail = dbLoadUserAccountByEmailFactory()
  const communicateUserTemporaryNewPassword = remoteCommunicateUserTemporaryNewPasswordFactory()
  return new RecuperateUserAccountController(
    validation,
    findUserAccountByEmail,
    communicateUserTemporaryNewPassword
  )
}
