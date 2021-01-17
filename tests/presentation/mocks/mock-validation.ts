import { Validation } from '@/presentation/interfaces/validation'

export class ValidationSpy implements Validation {
  validate (input: Validation.Params): Validation.Result {
    return null
  }
}
