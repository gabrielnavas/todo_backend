import {
  Controller,
  HttpRequest,
  Validation
} from '@/presentation/interfaces'
import { ValidationSpy } from '../mocks/mock-validation'
import { DeleteTodoItemController } from '@/presentation/controllers/delete-todo-item'
import { MissingParamError } from '@/presentation/errors'
import { httpResponseBadRequest } from '@/presentation/helpers/http-helper'

// const makeDeleteTodoItemSpy = (): InsertTodoItem => {
//   class DeleteTodoItemSpy implements DeleteTodoItem {
//     async insertOne (params: DeleteTodoItem.Params): Promise<DeleteTodoItem.Result> {
//       return true
//     }
//   }
//   return new DeleteTodoItemSpy()
// }

type TypeSut = {
  sut: Controller
  validationSpy: Validation
  // deleteTodoItemSpy: InsertTodoItem
}

const makeSut = (): TypeSut => {
  const validationSpy = new ValidationSpy()
  // const deleteTodoItemSpy = makeDeleteTodoItemSpy()
  const sut = new DeleteTodoItemController(
    validationSpy
    // deleteTodoItemSpy
  )
  return {
    sut,
    validationSpy
    // deleteTodoItemSpy
  }
}

describe('InsertTodoItemController', () => {
  test('should call validations with correct body data', async () => {
    const { sut, validationSpy: validation } = makeSut()
    const validationSpy = jest.spyOn(validation, 'validate')
    const httpRequest: HttpRequest = {
      accountId: 1,
      body: {
        idTodoItem: 1
      }
    }
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 badRequest if validations returns error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate')
      .mockReturnValueOnce(new MissingParamError('idTodoItem'))
    const httpRequest: HttpRequest = {
      accountId: 1,
      body: { }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(
      httpResponseBadRequest(new MissingParamError('idTodoItem'))
    )
  })

  // test('should call insertTodoItem usecase with correct params', async () => {
  //   const { sut, insertTodoItemSpy: insertTodoItem } = makeSut()
  //   const insertTodoItemSpy = jest.spyOn(insertTodoItem, 'insertOne')
  //   const httpRequest: HttpRequest = {
  //     accountId: 1,
  //     body: {
  //       idNameTodoArea: 'any_id_todo_area',
  //       title: 'any_title',
  //       description: 'any_description'
  //     }
  //   }
  //   const expectedParams = {
  //     user: { id: httpRequest.accountId },
  //     todoItem: httpRequest.body
  //   } as InsertTodoItem.Params
  //   await sut.handle(httpRequest)
  //   expect(insertTodoItemSpy).toHaveBeenCalledWith(expectedParams)
  // })

  // test('should return 400 if insertTodoItem returns null', async () => {
  //   const { sut, insertTodoItemSpy } = makeSut()
  //   jest.spyOn(insertTodoItemSpy, 'insertOne')
  //     .mockReturnValueOnce(Promise.resolve(null))
  //   const httpRequest: HttpRequest = {
  //     accountId: 1,
  //     body: {
  //       idNameTodoArea: 'any_id_todo_area',
  //       title: 'any_title',
  //       description: 'any_description'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse)
  //     .toEqual(httpResponseBadRequest(new UnexpectedError()))
  // })

  // test('should return 500 server error if insertTodoItem throws', async () => {
  //   const { sut, insertTodoItemSpy } = makeSut()
  //   jest.spyOn(insertTodoItemSpy, 'insertOne').mockRejectedValueOnce(
  //     new Error('any_error')
  //   )
  //   const httpRequest: HttpRequest = {
  //     accountId: 1,
  //     body: {
  //       idNameTodoArea: 'any_id_todo_area',
  //       title: 'any_title',
  //       description: 'any_description'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(httpResponseServerError(new Error('any_error')))
  // })

  // test('should return ok if insertTodoItem ok', async () => {
  //   const { sut } = makeSut()
  //   const httpRequest: HttpRequest = {
  //     accountId: 1,
  //     body: {
  //       idNameTodoArea: 'any_id_todo_area',
  //       title: 'any_title',
  //       description: 'any_description'
  //     }
  //   }
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(httpResponseOk({
  //     id: 1,
  //     idNameTodoArea: 'any_id_todo_area',
  //     title: 'any_title',
  //     description: 'any_description'
  //   }))
  // })
})
