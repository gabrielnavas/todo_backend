import { Decrypter } from '@/data/interfaces'
import { LoadUserAccountByIdAndToken } from '@/domain/usecases/load-user-account-by-id-token'
import { httpResponseOk, httpResponseServerError, httpResponseUnauthorized } from '@/presentation/helpers/http-helper'
import { Middleware } from '@/presentation/interfaces/middleware'
import { AuthenticationMiddleware } from '@/presentation/middlewares/authentication'
import { UnauthorizedError } from '@/presentation/errors'

const oneHourLast = 1000 * 60 * 60

const makeDecrypter = (): Decrypter => {
  return new class DecrypterSpy implements Decrypter {
    async decrypt (ciphertext: string): Promise<Decrypter.ReturnType> {
      return {
        issuedAt: oneHourLast,
        payload: { id: 1 }
      }
    }
  }()
}

const makeLoadUserAccountByToken = (): LoadUserAccountByIdAndToken => {
  return new class LoadUserAccountByTokenSpy implements LoadUserAccountByIdAndToken {
    async loadOneByIdAndToken (parasm: LoadUserAccountByIdAndToken.Params): Promise<LoadUserAccountByIdAndToken.Result> {
      return {
        id: 1,
        email: 'any_email',
        password: 'any_password',
        name: 'any_email'
      }
    }
  }()
}

type SutTypes = {
  sut: Middleware
  loadUserAccountByTokenSpy: LoadUserAccountByIdAndToken
  decrypterSpy: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterSpy = makeDecrypter()
  const loadUserAccountByTokenSpy = makeLoadUserAccountByToken()
  const sut = new AuthenticationMiddleware(
    loadUserAccountByTokenSpy,
    decrypterSpy
  )
  return {
    sut,
    loadUserAccountByTokenSpy,
    decrypterSpy
  }
}

describe('AuthenticationMiddleware', () => {
  test('should call decryptor with correct user access token ', async () => {
    const { sut, decrypterSpy: decrypter } = makeSut()
    const decrypterSpy = jest.spyOn(decrypter, 'decrypt')
    const sutParams = {
      accessToken: 'any_token'
    }
    await sut.handle(sutParams)
    expect(decrypterSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if decryptor token throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt')
      .mockRejectedValueOnce(new Error('any_error'))
    const sutParams = {
      accessToken: 'any_token'
    }
    const httpResponse = await sut.handle(sutParams)
    expect(httpResponse).toEqual(
      httpResponseUnauthorized(new UnauthorizedError()
      ))
  })

  test('should call LoadUserAccountByIdAndToken by with correct access token', async () => {
    const { sut, loadUserAccountByTokenSpy: loadUserAccountByToken } = makeSut()
    const loadAccountByTokenSpy = jest.spyOn(loadUserAccountByToken, 'loadOneByIdAndToken')
    await sut.handle<AuthenticationMiddleware.Params>({ accessToken: 'any_token' })
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith({
      idUser: 1,
      token: 'any_token'
    })
  })

  test('should return throw if LoadUserAccountByIdAndToken throws', async () => {
    const { sut, loadUserAccountByTokenSpy } = makeSut()
    jest.spyOn(loadUserAccountByTokenSpy, 'loadOneByIdAndToken').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle<AuthenticationMiddleware.Params>({ accessToken: 'any_token' })
    expect(httpResponse).toEqual(httpResponseServerError(new Error('any_error')))
  })

  test('should return forbidden 401 if LoadUserAccountByIdAndToken return null', async () => {
    const { sut, loadUserAccountByTokenSpy } = makeSut()
    jest.spyOn(loadUserAccountByTokenSpy, 'loadOneByIdAndToken').mockReturnValueOnce(null)
    const httpResponse = await sut.handle<AuthenticationMiddleware.Params>({ accessToken: 'any_token' })
    expect(httpResponse).toEqual(httpResponseUnauthorized(new UnauthorizedError()))
  })

  test('should return ok and a accountId if LoadUserAccountByIdAndToken return a user account ', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle<AuthenticationMiddleware.Params>({ accessToken: 'any_token' })
    expect(httpResponse).toEqual(httpResponseOk({ accountId: 1 }))
  })
})
