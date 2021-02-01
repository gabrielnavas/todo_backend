import { DeleteTodoItem } from '@/domain/usecases/delete-todo-item'
import { UnexpectedError } from '../errors'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '../helpers/http-helper'
import { Controller, HttpResponse, Validation } from '../interfaces'

export class DeleteTodoItemController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly deleteTodoItem: DeleteTodoItem
  ) {}

  async handle (httpRequest: DeleteTodoItemController.HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest)
      if (error) return httpResponseBadRequest(error)
      const deleteOk = await this.deleteTodoItem.deleteOne(httpRequest.idTodoItem)
      if (!deleteOk) return httpResponseBadRequest(new UnexpectedError())
      return httpResponseOk()
    } catch (error) {
      return httpResponseServerError()
    }
  }
}

export namespace DeleteTodoItemController {
  export type HttpRequest = {
    idTodoItem: number
    accountId: number
  }
}
