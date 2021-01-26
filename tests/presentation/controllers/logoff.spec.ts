import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, Validation } from '../interfaces'
import { ValidationSpy } from '../mocks/mock-validation'
import { LogoffController } from '@/presentation/controllers/logoff'
import { MinNumberError, UnexpectedError } from '@/presentation/errors'
import { Logoff } from '@/domain/usecases/logoff'

const makeuserLogoff = (): Logoff => {
  class UserLogoffSpy implements Logoff {
    async logoff (params: Logoff.Params): Promise<Logoff.Result> {
    }
  }
  return new UserLogoffSpy()
}

type TypeSut = {
  sut: Controller
  validationSpy: Validation,
  logoffSpy: Logoff
}

const makeSut = (): TypeSut => {
  const validationSpy = new ValidationSpy()
  const logoffSpy = makeuserLogoff()
  const sut = new LogoffController(validationSpy, logoffSpy)
  return {
    sut,
    validationSpy,
    logoffSpy
  }
}

describe('LogoffController', () => {
  test('should call validations with correct body data', async () => {
    const { sut, validationSpy: validation } = makeSut()
    const validationSpy = jest.spyOn(validation, 'validate')
    const httpRequest: HttpRequest = {
      accountId: 1
    }
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenLastCalledWith(httpRequest.accountId)
  })

  test('should return 400 badRequest if validations returns error', async () => {
    const { sut, validationSpy } = makeSut()
    const minLength = 0
    jest.spyOn(validationSpy, 'validate')
      .mockReturnValueOnce(new MinNumberError('accountId', minLength))
    const httpRequest: HttpRequest = {
      accountId: 0
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(httpResponseBadRequest(new MinNumberError('accountId', minLength)))
  })

  test('should call Logoff with correct user ID', async () => {
    const { sut, logoffSpy: logoff } = makeSut()
    const logoffSpy = jest.spyOn(logoff, 'logoff')
    const httpRequest: HttpRequest = {
      accountId: 1
    }
    await sut.handle(httpRequest)
    expect(logoffSpy).toHaveBeenCalledWith({ userId: httpRequest.accountId })
  })

  test('should call Logoff with correct user ID', async () => {
    const { sut, logoffSpy } = makeSut()
    jest.spyOn(logoffSpy, 'logoff').mockRejectedValueOnce(new Error('any_error'))
    const httpRequest: HttpRequest = {
      accountId: 1
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseServerError(new UnexpectedError()))
  })

  test('should return a userTokenUpdated if Logoff return userTokenUpdated', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      accountId: 1
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseOk())
  })
})
