import { httpResponseOk } from '../helpers/http-helper'
import { Controller, HttpResponse, Validation } from '../interfaces'

export class RecuperateuserAccount implements Controller {
  constructor (
    private readonly validation: Validation
    // private readonly verifyExistsEmail: LoadUserAccontByEmail,
    // private readonly createPasswordRandom: CreatePasswordRandom,
    // private readonly insertOnePasswordTemporary: InsertOnePasswordTemporaryByEmail,
    // private readonly sendEmail: SendEmail
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    return httpResponseOk()
  }
}
