import { InsertTodoItem } from '@/domain/usecases/insert-todo-item'
import { InsertTodoItemController } from '@/presentation/controllers/insert-todo-item'
import { MissingParamError, UnexpectedError } from '@/presentation/errors'
import {
  httpResponseBadRequest,
  httpResponseOk,
  httpResponseServerError
} from '@/presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  Validation
} from '@/presentation/interfaces'
import { ValidationSpy } from '../mocks/mock-validation'

const makeInsertTodoItem = (): InsertTodoItem => {
  class InsertTodoItemSpy implements InsertTodoItem {
    async insertOne (params: InsertTodoItem.Params): Promise<InsertTodoItem.Result> {
      return {
        id: 1,
        idNameTodoArea: 'any_id_todo_area',
        title: 'any_title',
        description: 'any_description'
      }
    }
  }
  return new InsertTodoItemSpy()
}

type TypeSut = {
  sut: Controller
  validationSpy: Validation
  insertTodoItemSpy: InsertTodoItem
}

const makeSut = (): TypeSut => {
  const validationSpy = new ValidationSpy()
  const insertTodoItemSpy = makeInsertTodoItem()
  const sut = new InsertTodoItemController(validationSpy, insertTodoItemSpy)
  return {
    sut,
    validationSpy,
    insertTodoItemSpy
  }
}

describe('InsertTodoItemController', () => {
  test('should call validations with correct body data', async () => {
    const { sut, validationSpy: validation } = makeSut()
    const validationSpy = jest.spyOn(validation, 'validate')
    const httpRequest: HttpRequest = {
      accountId: 1,
      body: {
        idNameTodoArea: 'any_id_todo_area',
        title: 'any_title',
        description: 'any_description'
      }
    }
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 badRequest if validations returns error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate')
      .mockReturnValueOnce(new MissingParamError('token'))
    const httpRequest: HttpRequest = {
      accountId: 1,
      body: {
        idNameTodoArea: 'any_id_todo_area',
        title: 'any_title',
        description: 'any_description'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(
      httpResponseBadRequest(new MissingParamError('token'))
    )
  })

  test('should call insertTodoItem usecase with correct params', async () => {
    const { sut, insertTodoItemSpy: insertTodoItem } = makeSut()
    const insertTodoItemSpy = jest.spyOn(insertTodoItem, 'insertOne')
    const httpRequest: HttpRequest = {
      accountId: 1,
      body: {
        idNameTodoArea: 'any_id_todo_area',
        title: 'any_title',
        description: 'any_description'
      }
    }
    const expectedParams = {
      user: { id: httpRequest.accountId },
      todoItem: httpRequest.body
    } as InsertTodoItem.Params
    await sut.handle(httpRequest)
    expect(insertTodoItemSpy).toHaveBeenCalledWith(expectedParams)
  })

  test('should return 400 if insertTodoItem returns null', async () => {
    const { sut, insertTodoItemSpy } = makeSut()
    jest.spyOn(insertTodoItemSpy, 'insertOne')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpRequest: HttpRequest = {
      accountId: 1,
      body: {
        idNameTodoArea: 'any_id_todo_area',
        title: 'any_title',
        description: 'any_description'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse)
      .toEqual(httpResponseBadRequest(new UnexpectedError()))
  })

  test('should return 500 server error if insertTodoItem throws', async () => {
    const { sut, insertTodoItemSpy } = makeSut()
    jest.spyOn(insertTodoItemSpy, 'insertOne').mockRejectedValueOnce(
      new Error('any_error')
    )
    const httpRequest: HttpRequest = {
      accountId: 1,
      body: {
        idNameTodoArea: 'any_id_todo_area',
        title: 'any_title',
        description: 'any_description'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseServerError(new Error('any_error')))
  })

  test('should return ok if insertTodoItem ok', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      accountId: 1,
      body: {
        idNameTodoArea: 'any_id_todo_area',
        title: 'any_title',
        description: 'any_description'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseOk({
      id: 1,
      idNameTodoArea: 'any_id_todo_area',
      title: 'any_title',
      description: 'any_description'
    }))
  })
})
