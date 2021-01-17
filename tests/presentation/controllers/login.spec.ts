import { Authentication } from '@/domain/usecases/authentication'
import { LoginController } from '@/presentation/controllers/login'
import { MissingParamError } from '@/presentation/errors'
import { UnauthorizedError } from '@/presentation/errors/unauthorized-error'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, Validation } from '@/presentation/interfaces'
import { ValidationSpy } from '../mocks/mock-validation'

type TypeSut = {
  sut: Controller
  validationSpy: Validation,
  authenticationSpy: Authentication
}

const makeAuthentication = () => {
  return new class AuthenticationSpy implements Authentication {
    async authenticate (params: Authentication.Params): Promise<Authentication.Result> {
      return {
        token: 'any_token',
        userName: 'any_name'
      }
    }
  }()
}

const makeSut = (): TypeSut => {
  const authenticationSpy = makeAuthentication()
  const validationSpy = new ValidationSpy()
  const sut = new LoginController(validationSpy, authenticationSpy)
  return {
    sut,
    validationSpy,
    authenticationSpy
  }
}

describe('LoginController', () => {
  test('should call validations with correct body data', async () => {
    const { sut, validationSpy: validation } = makeSut()
    const validationSpy = jest.spyOn(validation, 'validate')
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_name',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenLastCalledWith(httpRequest.body)
  })

  test('should return 400 badRequest if validations returns error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate')
      .mockReturnValueOnce(new MissingParamError('email'))
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(httpResponseBadRequest(new MissingParamError('email')))
  })

  test('should call authentication with correct params', async () => {
    const { sut, authenticationSpy: authentication } = makeSut()
    const authenticationSpy = jest.spyOn(authentication, 'authenticate')
    const httpRequest = {
      body: {
        email: 'any_name',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(authenticationSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 500 serverError if authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'authenticate').mockImplementation(async () => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        email: 'any_name',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseServerError(new Error()))
  })

  test('should 400 badRequest if email or password not found', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'authenticate').mockImplementation(null)
    const httpRequest = {
      body: {
        email: 'any_name',
        password: 'password_incorrect'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseBadRequest(new UnauthorizedError()))
  })

  test('should 200 Authentication ok', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_name',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseOk({
      token: 'any_token',
      userName: 'any_name'
    }))
  })
})