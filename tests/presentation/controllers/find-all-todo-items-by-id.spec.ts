import { TodoItemModel } from '@/domain/models/todo-item'
import { FindAllTodoItemsByUserId } from '@/domain/usecases/find-all-todo-by-user-id'
import { Controller, HttpRequest } from '../interfaces'
import { FindAllTodoItemsController } from '@/presentation/controllers/find-all-todo-items'
import { httpResponseOk, httpResponseServerError } from '@/presentation/helpers/http-helper'
import { UnexpectedError } from '@/presentation/errors'

const makeTodoItemMatrix = (): TodoItemModel[][] => [
  [
    ...Array<TodoItemModel>(3).fill({
      id: 1,
      idNameTodoArea: 'todo',
      title: 'any_title',
      description: 'any_description'
    }).map((t, i) => { t.id = i + 1; return t })
  ], [
    ...Array<TodoItemModel>(3).fill({
      id: 1,
      idNameTodoArea: 'doing',
      title: 'any_title',
      description: 'any_description'
    }).map((t, i) => { t.id = i + 1; return t })
  ], [
    ...Array<TodoItemModel>(3).fill({
      id: 1,
      idNameTodoArea: 'done',
      title: 'any_title',
      description: 'any_description'
    }).map((t, i) => { t.id = i + 1; return t })
  ]
]

const makeFindAllTodoItems = (): FindAllTodoItemsByUserId => {
  class FindAllTodoItemsSpy implements FindAllTodoItemsByUserId {
    async findAllByUserId (userId: FindAllTodoItemsByUserId.Params): Promise<FindAllTodoItemsByUserId.Result> {
      return makeTodoItemMatrix()
    }
  }
  return new FindAllTodoItemsSpy()
}

type SutTypes = {
  sut: Controller
  findAllTodoItemsSpy: FindAllTodoItemsByUserId
}

const makeSut = (): SutTypes => {
  const findAllTodoItemsSpy = makeFindAllTodoItems()
  const sut = new FindAllTodoItemsController(
    findAllTodoItemsSpy
  )
  return {
    sut,
    findAllTodoItemsSpy
  }
}

describe('FindAllTodoItems', () => {
  test('should call FindAllTodoItems with correct params', async () => {
    const { sut, findAllTodoItemsSpy: findAllTodoItems } = makeSut()
    const findAllTodoItemsSpy = jest.spyOn(findAllTodoItems, 'findAllByUserId')
    const httpRequest = {
      accountId: 1
    } as HttpRequest
    await sut.handle(httpRequest)
    expect(findAllTodoItemsSpy).toHaveBeenCalledWith(httpRequest.accountId)
  })

  test('should return throw if FindAllTodoItems throws', async () => {
    const { sut, findAllTodoItemsSpy } = makeSut()
    jest.spyOn(findAllTodoItemsSpy, 'findAllByUserId')
      .mockRejectedValueOnce(new Error('any_error'))
    const httpRequest = {
      accountId: 1
    } as HttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseServerError(new UnexpectedError()))
  })

  test('should empty arrays if FindAllTodoItems not found', async () => {
    const { sut, findAllTodoItemsSpy } = makeSut()
    jest.spyOn(findAllTodoItemsSpy, 'findAllByUserId')
      .mockResolvedValueOnce([])
    const httpRequest = {
      accountId: 1
    } as HttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseOk([]))
  })

  test('should return arrays and ok if FindAllTodoItems returns the arrays', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      accountId: 1
    } as HttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseOk(makeTodoItemMatrix()))
  })
})
