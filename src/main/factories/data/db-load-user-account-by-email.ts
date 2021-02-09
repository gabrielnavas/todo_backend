import { DbLoadUserAccountByEmail } from '@/data/usecases/db-load-user-account-by-email'
import { LoadUserAccountByEmail } from '@/domain/usecases/load-user-account-by-email'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'

export const dbLoadUserAccountByEmailFactory = (): LoadUserAccountByEmail => {
  const findOneUserByToken = new UserPostgreSQLRepository()
  return new DbLoadUserAccountByEmail(findOneUserByToken)
}
