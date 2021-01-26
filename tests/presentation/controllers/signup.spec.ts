import { CreateUserAccount } from '@/domain/usecases/create-user-account'
import { SignUpController } from '@/presentation/controllers/signup'
import {
  httpResponseBadRequest,
  httpResponseOk,
  httpResponseServerError
} from '@/presentation/helpers/http-helper'
import { Validation } from '@/presentation/interfaces/validation'
import { ValidationSpy } from '../mocks/mock-validation'
import { Controller, HttpRequest } from '../../../src/presentation/interfaces'
import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { EmailInUseError } from '@/presentation/errors/email-in-use-error'
import { Authentication } from '@/domain/usecases/authentication'
import { makeAuthenticationMock } from '../../data/mocks/mock-db-authentication'
import { UnexpectedError } from '@/presentation/errors'

const makeCreateUserAccount = (): CreateUserAccount => {
  class CreateUserAccountSpy implements CreateUserAccount {
    async createUser (params: CreateUserAccount.Params): Promise<CreateUserAccount.Result> {
      return true
    }
  }
  return new CreateUserAccountSpy()
}

type TypeSut = {
  sut: Controller
  validationSpy: Validation,
  createUserAccountSpy: CreateUserAccount
  authenticationSpy: Authentication
}

const makeSut = (): TypeSut => {
  const validationSpy = new ValidationSpy()
  const createUserAccountSpy = makeCreateUserAccount()
  const { sut: authenticationSpy } = makeAuthenticationMock()
  const sut = new SignUpController(validationSpy, createUserAccountSpy, authenticationSpy)
  return {
    sut,
    validationSpy,
    createUserAccountSpy,
    authenticationSpy
  }
}

describe('SignUpController', () => {
  test('should call validations with correct body data', async () => {
    const { sut, validationSpy: validation } = makeSut()
    const validationSpy = jest.spyOn(validation, 'validate')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_name',
        password: 'any_name',
        passwordConfirmation: 'any_name'
      }
    }
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenLastCalledWith(httpRequest.body)
  })

  test('should return 400 if validations fail', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(new MissingParamError('name'))
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_name',
        password: 'any_name',
        passwordConfirmation: 'any_name'
      }
    }
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(httpResponseBadRequest(new MissingParamError('name')))
  })

  test('should call CreateUserAccount with correct params', async () => {
    const { sut, createUserAccountSpy: createUserAccount } = makeSut()
    const createUserAccountSpy = jest.spyOn(createUserAccount, 'createUser')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_name',
        password: 'any_name',
        passwordConfirmation: 'any_name'
      }
    }
    await sut.handle(httpRequest)
    const { passwordConfirmation, ...userParams } = httpRequest.body
    expect(createUserAccountSpy).toHaveBeenLastCalledWith(userParams)
  })

  test('should return 500 if CreateUserAccount throws', async () => {
    const anyError = new Error()
    const { sut, createUserAccountSpy } = makeSut()
    jest.spyOn(createUserAccountSpy, 'createUser').mockImplementationOnce(async () => {
      throw anyError
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_name',
        password: 'any_name',
        passwordConfirmation: 'any_name'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseServerError(new UnexpectedError()))
  })

  test('should return 400 if CreateUserAccount emails exists', async () => {
    const { sut, createUserAccountSpy } = makeSut()
    jest.spyOn(createUserAccountSpy, 'createUser').mockReturnValueOnce(null)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_name',
        password: 'any_name',
        passwordConfirmation: 'any_name'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseBadRequest(new EmailInUseError()))
  })

  test('should call Authenticationer with correct params', async () => {
    const { sut, authenticationSpy: authentication } = makeSut()
    const authenticationSpy = jest.spyOn(authentication, 'authenticate')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_name',
        password: 'any_name',
        passwordConfirmation: 'any_name'
      }
    }
    const { email, password } = httpRequest.body
    await sut.handle(httpRequest)
    expect(authenticationSpy).toHaveBeenCalledWith({ email, password })
  })

  test('should return 500 throw Authenticationer if throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'authenticate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_name',
        password: 'any_name',
        passwordConfirmation: 'any_name'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseServerError(new UnexpectedError()))
  })

  test('should return 200 a token and userName if ok', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    const bodyReturn = {
      token: 'any_token',
      userName: httpRequest.body.name,
      email: httpRequest.body.email
    } as Authentication.Result
    expect(httpResponse).toEqual(httpResponseOk(bodyReturn))
  })
})
