import { DbLogoff } from '@/data/usecases/db-logoff'
import { DbUpdateTodoItem } from '@/data/usecases/db-update-todo-item'
import {
  UserTokenAccessPostgreSQLRepository
} from '@/infra/db/postgresql/repositories/user-token-access-repository'

export const dbLogoffFactory = () => {
  const userTokenAccessPostgreSQLRepository = new UserTokenAccessPostgreSQLRepository()
  return new DbLogoff(userTokenAccessPostgreSQLRepository)
}
