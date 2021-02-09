import { LoadUserAccountByEmail } from '@/domain/usecases/load-user-account-by-email'
import { FindOneUserByEmailRepository } from '../interfaces'

export class DbLoadUserAccountByEmail implements LoadUserAccountByEmail {
  constructor (
    private readonly checkEmailExists: FindOneUserByEmailRepository
  ) {}

  async loadByEmail (params: LoadUserAccountByEmail.Params):
    Promise<LoadUserAccountByEmail.Result> {
    const userAccount = this.checkEmailExists.findOneByEmail(params.email)
    return userAccount
  }
}
