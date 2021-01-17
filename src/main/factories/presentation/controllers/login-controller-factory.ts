import { LoginController } from '@/presentation/controllers/login'
import { Controller } from '@/presentation/interfaces'
import { dbAuthenticationFactory } from '../../data/usecases/db-authentication-factory'
import { makeLoginValidationFactory } from './login-validation-factory'

export const loginControllerFactory = (): Controller => {
  const validations = makeLoginValidationFactory()
  const dbAuthentication = dbAuthenticationFactory()
  return new LoginController(validations, dbAuthentication)
}
