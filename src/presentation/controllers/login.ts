import { Authentication } from '@/domain/usecases/authentication'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../interfaces'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly authentication: Authentication

  ) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return httpResponseBadRequest(error)
      const auth = await this.authentication.authenticate(httpRequest.body)
      if (!auth) return httpResponseBadRequest(new UnauthorizedError())
      return httpResponseOk(auth)
    } catch (error) {
      return httpResponseServerError(error)
    }
  }
}
