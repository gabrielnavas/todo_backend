import { httpResponseBadRequest, httpResponseOk } from '../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../interfaces'

export class DeleteTodoItemController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = await this.validation.validate(httpRequest.body)
    if (error) return httpResponseBadRequest(error)
    return httpResponseOk()
  }
}
