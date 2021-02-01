import { UpdateTodoItem } from '@/domain/usecases/update-todo-item'
import { UnexpectedError } from '../errors'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '../helpers/http-helper'
import { Controller, HttpResponse, Validation } from '../interfaces'

export class UpdateTodoItemController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly updateTodoItem: UpdateTodoItem

  ) {}

  async handle (httpRequest: UpdateTodoItemController.HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest)
      if (error) return httpResponseBadRequest(error)
      const updateTodoItemParams = this.mapUpdateHttpRequestToTodoItemParams(httpRequest)
      const todoItemUpdate = await this.updateTodoItem.updateOne(updateTodoItemParams)
      if (!todoItemUpdate) return httpResponseBadRequest(new UnexpectedError())
      return httpResponseOk(todoItemUpdate)
    } catch (error) {
      return httpResponseServerError()
    }
  }

  private mapUpdateHttpRequestToTodoItemParams (params: UpdateTodoItemController.HttpRequest): UpdateTodoItem.Params {
    const { accountId, ...rest } = params
    return {
      user: { id: accountId },
      todoItem: {
        id: rest.idTodoItem,
        idNameTodoArea: rest.idNameTodoArea,
        title: rest.title,
        description: rest.description
      }
    }
  }
}

export namespace UpdateTodoItemController {
  export type HttpRequest = {
    accountId: number
    idTodoItem: number,
    idNameTodoArea: string,
    title: string,
    description: string
  }
}
