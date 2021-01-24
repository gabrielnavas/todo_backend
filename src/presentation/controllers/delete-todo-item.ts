import { DeleteTodoItem } from '@/domain/usecases/delete-todo-item'
import { UnexpectedError } from '../errors'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../interfaces'

export class DeleteTodoItemController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly deleteTodoItem: DeleteTodoItem
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) return httpResponseBadRequest(error)
      const deleteOk = await this.deleteTodoItem.deleteOne(httpRequest.body.idTodoItem)
      if (!deleteOk) return httpResponseBadRequest(new UnexpectedError())
      return httpResponseOk()
    } catch (error) {
      return httpResponseServerError(error)
    }
  }
}
