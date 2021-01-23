import { Validation } from '@/presentation/interfaces'
import { MissingParamError } from '@/presentation/errors'
import { ValidationComposite } from './validation-composite'

export class RequiredFieldValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly validationCompositeAttributes?: ValidationComposite
  ) {}

  validate (input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }

    if (typeof input[this.fieldName] === 'object') {
      const error = this.validationCompositeAttributes.validate(input[this.fieldName])
      return error
    }
    return null
  }
}
