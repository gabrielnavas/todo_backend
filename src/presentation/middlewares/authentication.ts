import { LoadUserAccountByToken } from '@/domain/usecases/load-user-account-by-token'
import { AccessDeniedError } from '../errors/access-denied-error'
import {
  httpResponseForbidden,
  httpResponseOk,
  httpResponseServerError
} from '../helpers/http-helper'
import { HttpResponse } from '../interfaces'
import { Middleware } from '../interfaces/middleware'

export class AuthenticationMiddleware implements Middleware {
  constructor (
    private readonly findUserAccountByToken: LoadUserAccountByToken
  ) {}

  async handle (request: AuthenticationMiddleware.Params): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      const userAccount = await this.findUserAccountByToken.loadOneByToken(accessToken)
      if (!userAccount) return httpResponseForbidden(new AccessDeniedError())
      return httpResponseOk({ accountId: userAccount.id })
    } catch (error) {
      return httpResponseServerError(error)
    }
  }
}

export namespace AuthenticationMiddleware {
  export type Params = {
    accessToken?: string
  }
}
