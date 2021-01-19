import { dbUserInsertOneFactory } from '@/main/factories/data/usecases/db-user-insert-one'
import { SignUpController } from '@/presentation/controllers/signup'
import { Controller } from '@/presentation/interfaces'
import { dbAuthenticationFactory } from '../../data/usecases/db-authentication-factory'
import { makeSignUpValidationFactory } from './signup-validation-factory'

export const signupControllerFactory = (): Controller => {
  const validations = makeSignUpValidationFactory()
  const dbUserInsertOne = dbUserInsertOneFactory()
  const getAuthentication = dbAuthenticationFactory()
  return new SignUpController(
    validations,
    dbUserInsertOne,
    getAuthentication
  )
}
