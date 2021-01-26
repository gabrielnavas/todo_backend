import { LogoffController } from '@/presentation/controllers/logoff'
import { dbLogoffFactory } from '../data/db-logoff'
import { makeLogoffValidationFactory } from './logoff-validation-factory'

export const logoffControllerFactory = (): LogoffController => {
  const validations = makeLogoffValidationFactory()
  const dbUserInsertOne = dbLogoffFactory()
  return new LogoffController(
    validations,
    dbUserInsertOne
  )
}
