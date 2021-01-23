import { LoadUserAccountByIdAndToken } from '@/domain/usecases/load-user-account-by-id-token'
import { FindOneUserByIdAndTokenRepository } from '../interfaces/find-one-user-by-id-token-repository'

export class DbLoadUserAccountByToken implements LoadUserAccountByIdAndToken {
  constructor (
    private readonly findOneUserByIdAndToken: FindOneUserByIdAndTokenRepository
  ) {}

  async loadOneByIdAndToken (params: LoadUserAccountByIdAndToken.Params): Promise<LoadUserAccountByIdAndToken.Result> {
    const userAccount = await this.findOneUserByIdAndToken.findOneByIdAndToken({
      idUser: params.idUser,
      token: params.token
    })
    return userAccount
  }
}
