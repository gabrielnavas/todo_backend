import {
  Controller,
  Validation
} from '@/presentation/interfaces'
import { ValidationSpy } from '../mocks/mock-validation'
import { DeleteTodoItemController } from '@/presentation/controllers/delete-todo-item'
import { MissingParamError, UnexpectedError } from '@/presentation/errors'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '@/presentation/helpers/http-helper'
import { DeleteTodoItem } from '@/domain/usecases/delete-todo-item'

const makeDeleteTodoItemSpy = (): DeleteTodoItem => {
  class DeleteTodoItemSpy implements DeleteTodoItem {
    async deleteOne (params: DeleteTodoItem.Params): Promise<DeleteTodoItem.Result> {
      return true
    }
  }
  return new DeleteTodoItemSpy()
}

type TypeSut = {
  sut: Controller
  validationSpy: Validation
  deleteTodoItemSpy: DeleteTodoItem
}

const makeSut = (): TypeSut => {
  const validationSpy = new ValidationSpy()
  const deleteTodoItemSpy = makeDeleteTodoItemSpy()
  const sut = new DeleteTodoItemController(
    validationSpy,
    deleteTodoItemSpy
  )
  return {
    sut,
    validationSpy,
    deleteTodoItemSpy
  }
}

describe('DeleteTodoItemController', () => {
  test('should call validations with correct body data', async () => {
    const { sut, validationSpy: validation } = makeSut()
    const validationSpy = jest.spyOn(validation, 'validate')
    const httpRequest = {
      accountId: 1,
      idTodoItem: 1
    } as DeleteTodoItemController.HttpRequest
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return 400 badRequest if validations returns error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate')
      .mockReturnValueOnce(new MissingParamError('idTodoItem'))
    const httpRequest = {
      accountId: 1,
      idTodoItem: 1
    } as DeleteTodoItemController.HttpRequest
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(
      httpResponseBadRequest(new MissingParamError('idTodoItem'))
    )
  })

  test('should call DeleteTodoItem usecase with correct params', async () => {
    const { sut, deleteTodoItemSpy: deleteTodoItem } = makeSut()
    const deleteTodoItemSpy = jest.spyOn(deleteTodoItem, 'deleteOne')
    const httpRequest = {
      accountId: 1,
      idTodoItem: 1
    } as DeleteTodoItemController.HttpRequest
    await sut.handle(httpRequest)
    expect(deleteTodoItemSpy).toHaveBeenCalledWith(httpRequest.idTodoItem)
  })

  test('should return 400 if DeleteTodoItem returns false', async () => {
    const { sut, deleteTodoItemSpy } = makeSut()
    jest.spyOn(deleteTodoItemSpy, 'deleteOne')
      .mockResolvedValueOnce(false)
    const httpRequest = {
      accountId: 1,
      idTodoItem: 1
    } as DeleteTodoItemController.HttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse)
      .toEqual(httpResponseBadRequest(new UnexpectedError()))
  })

  test('should return 500 server error if insertTodoItem throws', async () => {
    const { sut, deleteTodoItemSpy } = makeSut()
    jest.spyOn(deleteTodoItemSpy, 'deleteOne').mockRejectedValueOnce(
      new Error('any_error')
    )
    const httpRequest = {
      accountId: 1,
      idTodoItem: 1
    } as DeleteTodoItemController.HttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(
      httpResponseServerError(new UnexpectedError())
    )
  })

  test('should return ok if insertTodoItem ok', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      accountId: 1,
      idTodoItem: 1
    } as DeleteTodoItemController.HttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseOk())
  })
})
