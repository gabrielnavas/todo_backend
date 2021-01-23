import { InsertTodoItemController } from '@/presentation/controllers/insert-todo-item'
import { Controller } from '@/presentation/interfaces'
import { insertOneTodoItemFactory } from '../../data/usecases/insert-todo-item-factory'
import { insertTodoItemValidationFactory } from './insert-todo-item-validation-factory'

export const insertTodoItemControllerFactory = (): Controller => {
  const validationCompose = insertTodoItemValidationFactory()
  const insertTodoItemUseCase = insertOneTodoItemFactory()
  return new InsertTodoItemController(validationCompose, insertTodoItemUseCase)
}
