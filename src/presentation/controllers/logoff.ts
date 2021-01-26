import { InvalidateOneUserTokenAccessByUserIdRepository } from '@/data/interfaces/invalidate-one-user-token-access-repository'
import { Logoff } from '@/domain/usecases/logoff'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../interfaces'

export class LogoffController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly userLogoff: Logoff
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.accountId)
      if (error) return httpResponseBadRequest(error)
      await this.userLogoff.logoff({ userId: httpRequest.accountId })
      return httpResponseOk()
    } catch (error) {
      return httpResponseServerError()
    }
  }
}
