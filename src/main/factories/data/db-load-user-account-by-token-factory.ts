import { DbLoadUserAccountByToken } from '@/data/usecases/db-load-user-account-by-id-token'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'

export const dbLoadUserAccountByTokenFactory = (): DbLoadUserAccountByToken => {
  const findOneUserByToken = new UserPostgreSQLRepository()
  return new DbLoadUserAccountByToken(findOneUserByToken)
}
