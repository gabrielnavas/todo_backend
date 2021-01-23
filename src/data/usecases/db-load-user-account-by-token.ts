import { LoadUserAccountByToken } from '@/domain/usecases/load-user-account-by-token'
import { FindOneUserByTokenRepository } from '../interfaces/find-one-user-by-token-repository'

export class DbLoadUserAccountByToken implements LoadUserAccountByToken {
  constructor (
    private readonly findOneUserByToken: FindOneUserByTokenRepository
  ) {}

  async loadOneByToken (token: LoadUserAccountByToken.Params): Promise<LoadUserAccountByToken.Result> {
    const userAccount = await this.findOneUserByToken.findOneByToken(token)
    return userAccount
  }
}
