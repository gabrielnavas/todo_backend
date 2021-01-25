import {
  ValidationComposite,
  RequiredFieldValidation
} from '@/validation/validators'
import { Validation } from '@/presentation/interfaces'

export const deleteTodoItemValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['idTodoItem']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
