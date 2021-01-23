import { DbInsertTodoItem } from '@/data/usecases/db-insert-todo-item'
import { TodoItemPostgreSQLRepository } from '@/infra/db/postgresql/repositories/todo-item-repository'

export const dbInsertOneTodoItemFactory = () => {
  const todoItemRepository = new TodoItemPostgreSQLRepository()
  return new DbInsertTodoItem(todoItemRepository)
}
