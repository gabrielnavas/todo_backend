import {
  CommunicateUserTemporaryNewPassword
} from '@/domain/usecases/communicate-user-temporary-password'
import {
  LoadUserAccontByEmail
} from '@/domain/usecases/load-user-accont-by-email'
import {
  httpResponseBadRequest,
  httpResponseOk,
  httpResponseServerError
} from '../helpers/http-helper'
import { Controller, HttpResponse, Validation } from '../interfaces'

export class RecuperateUserAccountController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly verifyExistsEmail: LoadUserAccontByEmail,
    private readonly communicateUserTemporaryNewPassword: CommunicateUserTemporaryNewPassword
  ) {}

  async handle (httpRequest: RecuperateUserAccountController.HttpRequest):
    Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest)
      if (error) {
        return httpResponseBadRequest(error)
      }
      const userAccountFound = await this.verifyExistsEmail.loadByEmail({
        email: httpRequest.email
      })
      if (userAccountFound) {
        await this.communicateUserTemporaryNewPassword.handle(userAccountFound)
      }
      return httpResponseOk()
    } catch {
      return httpResponseServerError()
    }
  }
}

export namespace RecuperateUserAccountController {
  export type HttpRequest = {
    email: string
  }
}
