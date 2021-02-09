import {
  RequiredFieldValidation
} from '@/validation/validators'
import { Validation } from '@/presentation/interfaces'

export const recuperateUserAccountValidationFactory = (): Validation => {
  return new RequiredFieldValidation('email')
}
