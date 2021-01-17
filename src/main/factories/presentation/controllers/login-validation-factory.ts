import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '@/validation/validators'
import { Validation } from '@/presentation/interfaces'
import { EmailValidatorAdapter } from '@/infra/validation/email-validator-adapter'

export const makeLoginValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
