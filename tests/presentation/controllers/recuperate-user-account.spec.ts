import { Controller, Validation } from '../interfaces'
import { ValidationSpy } from '../mocks/mock-validation'
import { RecuperateUserAccountController } from '@/presentation/controllers/recuperate-user-account'
import { MissingParamError, UnexpectedError } from '@/presentation/errors'
import { httpResponseBadRequest, httpResponseOk, httpResponseServerError } from '@/presentation/helpers/http-helper'
import { UserAccountModel } from '@/domain/models/user-account'
import { LoadUserAccontByEmail } from '@/domain/usecases/load-user-accont-by-email'
import { CommunicateUserTemporaryNewPassword } from '@/domain/usecases/communicate-user-temporary-password'

const makeLoadUserAccontByEmail = (): LoadUserAccontByEmail => {
  class LoadUserAccontByEmailSpy implements LoadUserAccontByEmail {
    loadByEmail (params: LoadUserAccontByEmail.Params): Promise<LoadUserAccontByEmail.Result> {
      return Promise.resolve({
        id: 1,
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      } as UserAccountModel)
    }
  }
  return new LoadUserAccontByEmailSpy()
}

const makeCommunicateUserTemporaryNewPassword = (): CommunicateUserTemporaryNewPassword => {
  class CommunicateUserTemporaryNewPasswordSpy implements CommunicateUserTemporaryNewPassword {
    async handle (userAccount: UserAccountModel): Promise<void> {
    }
  }
  return new CommunicateUserTemporaryNewPasswordSpy()
}

type SutTypes = {
  sut: Controller,
  validationSpy : Validation
  loadUserAccontByEmailSpy: LoadUserAccontByEmail
  communicateUserTemporaryNewPasswordSpy: CommunicateUserTemporaryNewPassword
}

const makeSut = (): SutTypes => {
  const communicateUserTemporaryNewPasswordSpy = makeCommunicateUserTemporaryNewPassword()
  const loadUserAccontByEmailSpy = makeLoadUserAccontByEmail()
  const validationSpy = new ValidationSpy()
  const sut = new RecuperateUserAccountController(
    validationSpy,
    loadUserAccontByEmailSpy,
    communicateUserTemporaryNewPasswordSpy
  )
  return {
    sut,
    validationSpy,
    loadUserAccontByEmailSpy,
    communicateUserTemporaryNewPasswordSpy
  }
}

describe('RecuperateuserAccount', () => {
  test('should call validations with correct body data', async () => {
    const { sut, validationSpy: validation } = makeSut()
    const validationSpy = jest.spyOn(validation, 'validate')
    const httpRequest = {
      email: 'any_email'
    } as RecuperateUserAccountController.HttpRequest
    await sut.handle(httpRequest)
    expect(validationSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return 400 badRequest if validations returns error', async () => {
    const { sut, validationSpy } = makeSut()
    jest.spyOn(validationSpy, 'validate')
      .mockReturnValueOnce(new MissingParamError('email'))
    const httpRequest = {} as RecuperateUserAccountController.HttpRequest
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(
      httpResponseBadRequest(new MissingParamError('email'))
    )
  })

  test('should call LoadUserAccontByEmail with correct email', async () => {
    const { sut, loadUserAccontByEmailSpy: loadUserAccontByEmail } = makeSut()
    const loadUserAccontByEmailSpy = jest.spyOn(loadUserAccontByEmail, 'loadByEmail')
    const httpRequest = {
      email: 'any_email'
    } as RecuperateUserAccountController.HttpRequest
    await sut.handle(httpRequest)
    expect(loadUserAccontByEmailSpy)
      .toHaveBeenCalledWith({ email: httpRequest.email })
  })

  test('should return serverError 500 if LoadUserAccontByEmail throws', async () => {
    const { sut, loadUserAccontByEmailSpy } = makeSut()
    jest.spyOn(loadUserAccontByEmailSpy, 'loadByEmail')
      .mockRejectedValueOnce(new Error('any_error'))
    const httpRequest = {
      email: 'any_email'
    } as RecuperateUserAccountController.HttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseServerError(new UnexpectedError()))
  })

  test('should call communicateUserTemporaryNewPassword with correct params if user found', async () => {
    const {
      sut,
      communicateUserTemporaryNewPasswordSpy: communicateUserTemporaryNewPassword
    } = makeSut()
    const communicateUserTemporaryNewPasswordSpy =
      jest.spyOn(communicateUserTemporaryNewPassword, 'handle')
    const httpRequest = {
      email: 'any_email'
    } as RecuperateUserAccountController.HttpRequest
    await sut.handle(httpRequest)
    expect(communicateUserTemporaryNewPasswordSpy)
      .toHaveBeenCalledWith({
        id: 1,
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      })
  })

  test('should return server error if communicateUserTemporaryNewPassword return errror', async () => {
    const { sut, communicateUserTemporaryNewPasswordSpy } = makeSut()
    jest.spyOn(communicateUserTemporaryNewPasswordSpy, 'handle')
      .mockRejectedValueOnce(new Error('any_error'))
    const httpRequest = {
      email: 'any_email'
    } as RecuperateUserAccountController.HttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse)
      .toEqual(httpResponseServerError(new UnexpectedError()))
  })

  test('should return ok if email sended', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      email: 'any_email'
    } as RecuperateUserAccountController.HttpRequest
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(httpResponseOk())
  })
})
