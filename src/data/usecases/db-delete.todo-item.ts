import { DeleteTodoItem } from '@/domain/usecases/delete-todo-item'
import { DeleteOneTodoItemRepository } from '@/data/interfaces/delete-one-todo-item-repository'

export class DbDeleteTodoItem implements DeleteTodoItem {
  constructor (
    private readonly deleteOneTodoItemRespository: DeleteOneTodoItemRepository
  ) {}

  async deleteOne (id: DeleteTodoItem.Params): Promise<DeleteTodoItem.Result> {
    const todoItem = await this.deleteOneTodoItemRespository.deleteOne(id)
    return !!todoItem
  }
}
