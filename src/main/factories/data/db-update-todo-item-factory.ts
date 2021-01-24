import { DbUpdateTodoItem } from '@/data/usecases/db-update-todo-item'
import { TodoItemPostgreSQLRepository } from '@/infra/db/postgresql/repositories/todo-item-repository'

export const dbUpdateOneTodoItemFactory = () => {
  const todoItemRepository = new TodoItemPostgreSQLRepository()
  return new DbUpdateTodoItem(todoItemRepository)
}
