import { LoadUserAccountByToken } from '@/domain/usecases/load-user-account-by-token'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { httpResponseForbidden, httpResponseOk, httpResponseServerError } from '@/presentation/helpers/http-helper'
import { Middleware } from '@/presentation/interfaces/middleware'
import { AuthenticationMiddleware } from '@/presentation/middlewares/authentication'

const makeLoadUserAccountByToken = (): LoadUserAccountByToken => {
  return new class LoadUserAccountByTokenSpy implements LoadUserAccountByToken {
    async loadOneByToken (parasm: LoadUserAccountByToken.Params): Promise<LoadUserAccountByToken.Result> {
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
  loadUserAccountByTokenSpy: LoadUserAccountByToken
}

const makeAuthentication = (): SutTypes => {
  const loadUserAccountByTokenSpy = makeLoadUserAccountByToken()
  const sut = new AuthenticationMiddleware(loadUserAccountByTokenSpy)
  return {
    sut,
    loadUserAccountByTokenSpy
  }
}

describe('AuthenticationMiddleware', () => {
  test('should call FindUserAccountByToken by with correct access token', async () => {
    const { sut, loadUserAccountByTokenSpy: loadUserAccountByToken } = makeAuthentication()
    const loadAccountByTokenSpy = jest.spyOn(loadUserAccountByToken, 'loadOneByToken')
    await sut.handle<AuthenticationMiddleware.Params>({ accessToken: 'any_token' })
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if FindUserAccountByToken throws', async () => {
    const { sut, loadUserAccountByTokenSpy } = makeAuthentication()
    jest.spyOn(loadUserAccountByTokenSpy, 'loadOneByToken').mockRejectedValueOnce(new Error('any_error'))
    const httpResponse = await sut.handle<AuthenticationMiddleware.Params>({ accessToken: 'any_token' })
    expect(httpResponse).toEqual(httpResponseServerError(new Error('any_error')))
  })

  test('should return forbidden 403 if FindUserAccountByToken return null', async () => {
    const { sut, loadUserAccountByTokenSpy } = makeAuthentication()
    jest.spyOn(loadUserAccountByTokenSpy, 'loadOneByToken').mockReturnValueOnce(null)
    const httpResponse = await sut.handle<AuthenticationMiddleware.Params>({ accessToken: 'any_token' })
    expect(httpResponse).toEqual(httpResponseForbidden(new AccessDeniedError()))
  })

  test('should return ok and a accountId if FindUserAccountByToken return a user account ', async () => {
    const { sut } = makeAuthentication()
    const httpResponse = await sut.handle<AuthenticationMiddleware.Params>({ accessToken: 'any_token' })
    expect(httpResponse).toEqual(httpResponseOk({ accountId: 1 }))
  })
})
