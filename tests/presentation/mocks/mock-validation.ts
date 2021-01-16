import { Validation } from '@/validation/protocols/validation'

export class ValidationSpy implements Validation {
  validate (input: Validation.Params): Validation.Result {
    return null
  }
}
