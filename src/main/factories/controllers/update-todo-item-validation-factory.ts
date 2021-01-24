import {
  ValidationComposite,
  RequiredFieldValidation
} from '@/validation/validators'
import { Validation } from '@/presentation/interfaces'

export const updateTodoItemValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['idTodoItem', 'idNameTodoArea', 'title', 'description']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}