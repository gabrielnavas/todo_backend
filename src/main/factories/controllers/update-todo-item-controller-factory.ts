import { UpdateTodoItemController } from '@/presentation/controllers/update-todo-item'
import { Controller } from '@/presentation/interfaces'
import { dbUpdateOneTodoItemFactory } from '../data/db-update-todo-item-factory'
import { updateTodoItemValidationFactory } from './update-todo-item-validation-factory'

export const updateTodoItemControllerFactory = (): Controller => {
  const validationCompose = updateTodoItemValidationFactory()
  const dbUpdateOneTodoItemUseCase = dbUpdateOneTodoItemFactory()
  return new UpdateTodoItemController(
    validationCompose,
    dbUpdateOneTodoItemUseCase
  )
}
