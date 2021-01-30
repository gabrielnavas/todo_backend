import { FindAllTodoItemsByUserId } from "@/domain/usecases/find-all-todo-by-user-id";
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from "../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse, Validation } from "../interfaces";

export class FindAllTodoItemsController implements Controller {

  constructor(
    private readonly findAllTodoItemsByUserId: FindAllTodoItemsByUserId
  ){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
    const {accountId} = httpRequest
    const todoItems = await this.findAllTodoItemsByUserId.findAllByUserId(accountId)
    return httpResponseOk(todoItems)
    }
    catch(error) {
      return httpResponseServerError()
    }
  }
}
}
