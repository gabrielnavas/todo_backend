import { DbCreateUserAccount } from '@/data/usecases/db-create-user-account'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'

export const dbUserInsertOneFactory = () => {
  const userRepository = new UserPostgreSQLRepository()
  const salt = 12
  const bCryptAdapter = new BcryptAdapter(salt)
  return new DbCreateUserAccount(bCryptAdapter, userRepository, userRepository)
}
