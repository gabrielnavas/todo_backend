// negative-or-zero-value-error

import { Validation } from '@/presentation/interfaces'
import { MinNumberError } from '@/presentation/errors'

export class MinNumberValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly min: number
  ) {}

  validate (input: any): Error {
    if (Number(!input[this.fieldName]) < this.min) {
      return new MinNumberError(this.fieldName, this.min)
    }
  }
}
