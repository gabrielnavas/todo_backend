import {
  ValidationComposite,
  RequiredObjectValidation,
  RequiredFieldValidation
} from '@/validation/validators'
import { Validation } from '@/presentation/interfaces'

export const insertTodoItemValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  const userAccessValidations: Validation[] = []
  const todoItemValidations: Validation[] = []
  userAccessValidations.push(new RequiredFieldValidation('token'))
  todoItemValidations.push(
    new RequiredFieldValidation('idNameTodoArea'),
    new RequiredFieldValidation('title'),
    new RequiredFieldValidation('description')
  )

  validations.push(new RequiredObjectValidation('userAccess', new ValidationComposite(userAccessValidations)))
  validations.push(new RequiredObjectValidation('todoItem', new ValidationComposite(todoItemValidations)))

  return new ValidationComposite(validations)
}
