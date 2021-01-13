import { DbUserInsertOne } from '@/data/usecases/db-user-insert-one'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'

export const dbUserInsertOneFactory = () => {
  const userRepository = new UserPostgreSQLRepository()
  return new DbUserInsertOne(userRepository)
}
