import { Logoff } from '@/domain/usecases/logoff'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '../helpers/http-helper'
import { Controller, HttpResponse, Validation } from '../interfaces'

export class LogoffController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly userLogoff: Logoff
  ) {}

  async handle (httpRequest: LogoffController.HttpRequest): Promise<HttpResponse> {
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

export namespace LogoffController {
  export type HttpRequest = {
    accountId: number
  }
}
