import { Validation } from '@/presentation/interfaces'
import { MissingParamError } from '@/presentation/errors'
import { ValidationComposite } from './validation-composite'

export class RequiredObjectValidation implements Validation {
  constructor (
    private readonly objectName: string,
    private readonly validationCompositeAttributes: ValidationComposite
  ) {}

  validate (input: any): Error {
    if (!input[this.objectName]) {
      return new MissingParamError(`${this.objectName} object`)
    }
    const error = this.validationCompositeAttributes.validate(input[this.objectName])
    return error
  }
}
