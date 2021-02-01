import { FindAllTodoItemsByUserId } from '@/domain/usecases/find-all-todo-by-user-id'
import { httpResponseOk, httpResponseServerError } from '../helpers/http-helper'
import { Controller, HttpResponse } from '../interfaces'

export class FindAllTodoItemsByUserIdController implements Controller {
  constructor (
    private readonly findAllTodoItemsByUserId: FindAllTodoItemsByUserId
  ) {}

  async handle (httpRequest: FindAllTodoItemsByUserIdController.HttpRequest): Promise<HttpResponse> {
    try {
      const { accountId } = httpRequest
      const todoItems = await this.findAllTodoItemsByUserId.findAllByUserId(accountId)
      return httpResponseOk(todoItems)
    } catch (error) {
      return httpResponseServerError()
    }
  }
}

export namespace FindAllTodoItemsByUserIdController {
  export type HttpRequest = {
    accountId: number
  }
}
