import { InsertTodoItem } from '@/domain/usecases/insert-todo-item'
import { UnexpectedError } from '../errors/unexpected-error'
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
    private readonly insertTodoItem: InsertTodoItem
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return httpResponseBadRequest(error)
      const insertTodoItemParams = {
        todoItem: httpRequest.body,
        user: { id: httpRequest.accountId }
      } as InsertTodoItem.Params
      const insertOk = await this.insertTodoItem.insertOne(insertTodoItemParams)
      if (!insertOk) return httpResponseBadRequest(new UnexpectedError())
      return httpResponseOk(insertOk)
    } catch (error) {
      return httpResponseServerError(error)
    }
  }
}
