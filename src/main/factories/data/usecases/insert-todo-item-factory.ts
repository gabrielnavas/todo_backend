import { DbInsertTodoItem } from '@/data/usecases/db-insert-todo-item'
import { JwtAdapter } from '@/infra/cryptography'
import { TodoItemPostgreSQLRepository } from '@/infra/db/postgresql/repositories/todo-item-repository'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'
import env from '@/main/configs/env'

export const insertOneTodoItemFactory = () => {
  const jwtAdapter = new JwtAdapter(env.jwtKeySecret)
  const userRepository = new UserPostgreSQLRepository()
  const todoItemRepository = new TodoItemPostgreSQLRepository()
  return new DbInsertTodoItem(jwtAdapter, userRepository, todoItemRepository)
}
