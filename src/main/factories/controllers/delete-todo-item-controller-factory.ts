
import { DeleteTodoItemController } from '@/presentation/controllers/delete-todo-item'
import { Controller } from '@/presentation/interfaces'
import { dbDeleteOneTodoItemFactory } from '../data/db-delete-todo-item'
import { deleteTodoItemValidationFactory } from './delete-todo-item-validation-factory'

export const deleteTodoItemControllerFactory = (): Controller => {
  const validationCompose = deleteTodoItemValidationFactory()
  const deleteTodoItemUseCase = dbDeleteOneTodoItemFactory()
  return new DeleteTodoItemController(validationCompose, deleteTodoItemUseCase)
}
