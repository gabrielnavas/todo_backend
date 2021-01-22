import { InsertTodoItem } from '@/domain/usecases/insert-todo-item'
import { InvalidUserTokenError } from '../errors/user-access-token-invalid-error'
import {
  httpResponseBadRequest,
  httpResponseOk,
  httpResponseServerError
} from '../helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validation
} from '../interfaces'

export class InsertTodoItemController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly insertTodoItemSpy: InsertTodoItem
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return httpResponseBadRequest(error)
      const insertOk = await this.insertTodoItemSpy.insertOne(httpRequest.body)
      if (!insertOk) return httpResponseBadRequest(new InvalidUserTokenError())
      return httpResponseOk()
    } catch (error) {
      return httpResponseServerError(error)
    }
  }
}
