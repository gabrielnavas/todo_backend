import { Decrypter } from '@/data/interfaces'
import { LoadUserAccountByIdAndToken } from '@/domain/usecases/load-user-account-by-id-token'
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
    private readonly findUserAccountByToken: LoadUserAccountByIdAndToken,
    private readonly decrypterToken: Decrypter
  ) {}

  async handle (request: AuthenticationMiddleware.Params): Promise<HttpResponse> {
    let idUser = undefined as number
    let accessToken = undefined as string

    try {
      accessToken = request.accessToken
      const { payload } = await this.decrypterToken.decrypt(accessToken)
      idUser = payload.id
    } catch (error) {
      return httpResponseForbidden(new AccessDeniedError())
    }

    try {
      const userAccount = await this.findUserAccountByToken.loadOneByIdAndToken({
        idUser,
        token: accessToken
      })
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
