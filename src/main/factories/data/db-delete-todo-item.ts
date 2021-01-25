import { DbDeleteTodoItem } from '@/data/usecases/db-delete.todo-item'
import { TodoItemPostgreSQLRepository } from '@/infra/db/postgresql/repositories/todo-item-repository'

export const dbDeleteOneTodoItemFactory = () => {
  const todoItemRepository = new TodoItemPostgreSQLRepository()
  return new DbDeleteTodoItem(todoItemRepository)
}
