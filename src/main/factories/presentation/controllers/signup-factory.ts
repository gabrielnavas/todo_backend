import { dbUserInsertOneFactory } from '@/main/factories/data/usecases/db-user-insert-one'
import { SignupController } from '@/presentation/controllers/signup'

export const signupControllerFactory = () => {
  const dbUserInsertOne = dbUserInsertOneFactory()
  return new SignupController(dbUserInsertOne)
}
