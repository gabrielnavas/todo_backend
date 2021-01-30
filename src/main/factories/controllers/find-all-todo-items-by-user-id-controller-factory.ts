import { FindAllTodoItemsByUserIdController } from '@/presentation/controllers/find-all-todo-items-by-user-id'
import { Controller } from '@/presentation/interfaces'
import { dbFindAllTodoItemsByUserIdItemFactory } from '../data/db-find-all-todo-items-by-user-id-factory'

export const findAllTodoItemsByUserIdControllerFactory = (): Controller => {
  const insertTodoItemUseCase = dbFindAllTodoItemsByUserIdItemFactory()
  return new FindAllTodoItemsByUserIdController(insertTodoItemUseCase)
}
