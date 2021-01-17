import { dbUserInsertOneFactory } from '@/main/factories/data/usecases/db-user-insert-one'
import { SignUpController } from '@/presentation/controllers/signup'
import { makeSignUpValidation } from './signup-validation-factory'

export const signupControllerFactory = () => {
  const validations = makeSignUpValidation()
  const dbUserInsertOne = dbUserInsertOneFactory()
  return new SignUpController(validations, dbUserInsertOne)
}
