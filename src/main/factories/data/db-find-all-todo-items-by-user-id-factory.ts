import { FindAllTodoItemsByUserIdRepository } from '@/data/interfaces/find-all-todo-items-by-user-id-repository'
import { DbFindAllTodoItemsByUserId } from '@/data/usecases/db-find-all-todo-items-by-user-id'
import { MatrixClassicationTodoItems } from '@/data/usecases/db-find-all-todo-items-by-user-id/matrix-classification-todo-items'
import { TodoItemPostgreSQLRepository } from '@/infra/db/postgresql/repositories/todo-item-repository'

export const dbFindAllTodoItemsByUserIdItemFactory = () => {
  const findAllTodoItemsByUserIdRepository = new TodoItemPostgreSQLRepository()
  const matrixClassificationTodoItems = new MatrixClassicationTodoItems()
  const instance = new DbFindAllTodoItemsByUserId(
    findAllTodoItemsByUserIdRepository,
    matrixClassificationTodoItems
  )
  return instance
}
