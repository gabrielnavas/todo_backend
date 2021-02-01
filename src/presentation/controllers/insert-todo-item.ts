import { InsertTodoItem } from '@/domain/usecases/insert-todo-item'
import { UnexpectedError } from '../errors/unexpected-error'
import {
  httpResponseBadRequest,
  httpResponseOk,
  httpResponseServerError
} from '../helpers/http-helper'
import {
  Controller,
  HttpResponse,
  Validation
} from '../interfaces'

export class InsertTodoItemController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly insertTodoItem: InsertTodoItem
  ) {}

  async handle (httpRequest: InsertTodoItemController.HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest)
      if (error) return httpResponseBadRequest(error)
      const { accountId, ...todoItem } = httpRequest
      const insertTodoItemParams = {
        todoItem,
        user: { id: accountId }
      } as InsertTodoItem.Params
      const insertOk = await this.insertTodoItem.insertOne(insertTodoItemParams)
      if (!insertOk) return httpResponseBadRequest(new UnexpectedError())
      return httpResponseOk(insertOk)
    } catch (error) {
      return httpResponseServerError()
    }
  }
}

export namespace InsertTodoItemController {
  export type HttpRequest = {
    accountId: number
    idNameTodoArea: string
    title: string
    description: string
  }
}
