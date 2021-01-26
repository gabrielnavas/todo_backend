import { Validation } from '@/presentation/interfaces'
import { MinNumberValidation } from '@/validation/validators/min-number-validation'

export const makeLogoffValidationFactory = (): Validation => {
  return new MinNumberValidation('accountId', 0)
}
