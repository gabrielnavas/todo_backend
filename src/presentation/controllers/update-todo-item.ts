import { UpdateTodoItem } from '@/domain/usecases/update-todo-item'
import { UnexpectedError } from '../errors'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, Validation } from '../interfaces'

export class UpdateTodoItemController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly updateTodoItem: UpdateTodoItem

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) return httpResponseBadRequest(error)
      const updateTodoItemParams = this.mapUpdateHttpRequestToTodoItemParams(httpRequest)
      const todoItemUpdate = await this.updateTodoItem.updateOne(updateTodoItemParams)
      if (!todoItemUpdate) return httpResponseBadRequest(new UnexpectedError())
      return httpResponseOk(todoItemUpdate)
    } catch (error) {
      return httpResponseServerError(error)
    }
  }

  private mapUpdateHttpRequestToTodoItemParams ({ body, accountId }: HttpRequest): UpdateTodoItem.Params {
    return {
      user: { id: accountId },
      todoItem: {
        id: body.idTodoItem,
        idNameTodoArea: body.idNameTodoArea,
        title: body.title,
        description: body.description
      }
    }
  }
}
