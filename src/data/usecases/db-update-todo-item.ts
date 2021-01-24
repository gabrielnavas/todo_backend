import { UpdateTodoItem } from '@/domain/usecases/update-todo-item'
import { UpdateOneTodoItemRespository } from '../interfaces/update-one-todo-item-respository'

export class DbUpdateTodoItem implements UpdateTodoItem {
  constructor (
    private readonly updateOneTodoItemRespository: UpdateOneTodoItemRespository
  ) {}

  async updateOne (params: UpdateTodoItem.Params): Promise<UpdateTodoItem.Result> {
    const updateParams = {
      todoItem: params.todoItem,
      user: params.user
    } as UpdateOneTodoItemRespository.Params
    const todoUpdated = await this.updateOneTodoItemRespository.updateOne(updateParams)
    return !!todoUpdated
  }
}
