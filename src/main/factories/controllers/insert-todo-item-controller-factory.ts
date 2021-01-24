import { InsertTodoItemController } from '@/presentation/controllers/insert-todo-item'
import { Controller } from '@/presentation/interfaces'
import { dbInsertOneTodoItemFactory } from '../data/db-insert-todo-item-factory'
import { insertTodoItemValidationFactory } from './insert-todo-item-validation-factory'

export const insertTodoItemControllerFactory = (): Controller => {
  const validationCompose = insertTodoItemValidationFactory()
  const insertTodoItemUseCase = dbInsertOneTodoItemFactory()
  return new InsertTodoItemController(validationCompose, insertTodoItemUseCase)
}
