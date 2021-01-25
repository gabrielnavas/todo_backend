import { Decrypter } from '@/data/interfaces'
import { LoadUserAccountByIdAndToken } from '@/domain/usecases/load-user-account-by-id-token'
import { UnauthorizedError } from '../errors'
import {
  httpResponseOk,
  httpResponseServerError,
  httpResponseUnauthorized
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
    let userAccount = undefined as LoadUserAccountByIdAndToken.Result

    try {
      accessToken = request.accessToken
      const resultDecrypt = await this.decrypterToken.decrypt(accessToken)
      idUser = resultDecrypt.payload.id
    } catch (error) {
      return httpResponseUnauthorized(new UnauthorizedError())
    }

    try {
      userAccount = await this.findUserAccountByToken.loadOneByIdAndToken({
        idUser,
        token: accessToken
      })
      if (!userAccount) return httpResponseUnauthorized(new UnauthorizedError())
    } catch (error) {
      return httpResponseServerError(error)
    }

    return httpResponseOk({ accountId: userAccount.id })
  }
}

export namespace AuthenticationMiddleware {
  export type Params = {
    accessToken?: string
  }
}
