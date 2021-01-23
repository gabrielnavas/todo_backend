import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '@/validation/validators'
import { Validation } from '@/presentation/interfaces'
import { EmailValidatorAdapter } from '@/infra/validation/email-validator-adapter'

/**
 *
 * {
        userAccess: {
          token: 'any_token'
        },
        todoItem: {
          idNameTodoArea: 'any_id_todo_area',
          title: 'any_title',
          description: 'any_description'
        }
      }
 */

export const insertTodoItemValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
