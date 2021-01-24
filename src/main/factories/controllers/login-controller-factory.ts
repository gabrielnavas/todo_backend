import { LoginController } from '@/presentation/controllers/login'
import { Controller } from '@/presentation/interfaces'
import { dbAuthenticationFactory } from '../data/db-authentication-factory'
import { loginValidationFactory } from './login-validation-factory'

export const loginControllerFactory = (): Controller => {
  const validations = loginValidationFactory()
  const dbAuthentication = dbAuthenticationFactory()
  return new LoginController(validations, dbAuthentication)
}
