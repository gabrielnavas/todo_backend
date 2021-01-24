import { ValidationSpy } from '../mocks/mock-validation'
import { UpdateTodoItem } from '@/domain/usecases/update-todo-item'
import { UpdateTodoItemController } from '@/presentation/controllers/update-todo-item'
import {
  MissingParamError,
  UnexpectedError
} from '@/presentation/errors'
import {
  httpResponseBadRequest,
  httpResponseServerError
} from '@/presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  Validation
} from '@/presentation/interfaces'

const makeUpdateTodoItem = (): UpdateTodoItem => {
  return new class UpdateTodoItemSpy implements UpdateTodoItem {
    async updateOne (params: UpdateTodoItem.Params): Promise<UpdateTodoItem.Result> {
      return {
        id: 1,
        idNameTodoArea: 'any_id_todo_area',
        title: 'any_title',
        description: 'any_description'
      }
    }
  }()
}

type SutTypes = {
  sut: Controller
  validateSpy: Validation
  updateTodoItemSpy: UpdateTodoItem
}

const makeSut = (): SutTypes => {
  const validateSpy = new ValidationSpy()
  const updateTodoItemSpy = makeUpdateTodoItem()
  const sut = new UpdateTodoItemController(validateSpy, updateTodoItemSpy)
  return {
    sut,
    validateSpy,
    updateTodoItemSpy
  }
}

describe('UpdateTodoItemController', () => {
  describe('Validations', () => {
    test('should call validate with correct params', async () => {
      const { sut, validateSpy: validate } = makeSut()
      const validateSpy = jest.spyOn(validate, 'validate')
      const httpRequest: HttpRequest = {
        accountId: 1,
        body: {
          idTodoItem: 1,
          idNameTodoArea: 'any_id_todo_area',
          title: 'any_title',
          description: 'any_description'
        }
      }
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    test('should return 400 if validations fail', async () => {
      const { sut, validateSpy } = makeSut()
      jest.spyOn(validateSpy, 'validate').mockReturnValueOnce(new MissingParamError('name'))
      const httpRequest: HttpRequest = {
        accountId: 1,
        body: {
          idTodoItem: 1,
          idNameTodoArea: 'any_id_todo_area',
          description: 'any_description'
        }
      }
      const response = await sut.handle(httpRequest)
      expect(response).toEqual(httpResponseBadRequest(new MissingParamError('name')))
    })
  })

  describe('UseCase UpdateTodoItem', () => {
    test('should call UpdateTodoItem with correct params', async () => {
      const { sut, updateTodoItemSpy: updateTodoItem } = makeSut()
      const updateTodoItemSpy = jest.spyOn(updateTodoItem, 'updateOne')
      const httpRequest: HttpRequest = {
        accountId: 1,
        body: {
          idTodoItem: 1,
          idNameTodoArea: 'any_id_todo_area',
          title: 'any_title',
          description: 'any_description'
        }
      }
      await sut.handle(httpRequest)
      expect(updateTodoItemSpy).toHaveBeenLastCalledWith({
        user: { id: httpRequest.accountId },
        todoItem: {
          id: httpRequest.body.idTodoItem,
          idNameTodoArea: httpRequest.body.idNameTodoArea,
          title: httpRequest.body.title,
          description: httpRequest.body.description
        }
      })
    })
  })

  test('should return 400 bad request if UpdateTodoItem returns null', async () => {
    const { sut, updateTodoItemSpy } = makeSut()
    jest.spyOn(updateTodoItemSpy, 'updateOne')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpRequest: HttpRequest = {
      accountId: 1,
      body: {
        idTodoItem: 1,
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
    const { sut, updateTodoItemSpy } = makeSut()
    jest.spyOn(updateTodoItemSpy, 'updateOne')
      .mockRejectedValueOnce(new Error('any_error'))
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
      .toEqual(httpResponseServerError(new Error('any_error')))
  })
})
