import { InsertTodoItem } from '@/domain/usecases/insert-todo-item'
import { InsertOneTodoItemRespository } from '../interfaces/insert-one-todo-item-repository'

export class DbInsertTodoItem implements InsertTodoItem {
  constructor (
    private readonly insertTodoItemRepository: InsertOneTodoItemRespository
  ) {}

  async insertOne (params: InsertTodoItem.Params): Promise<InsertTodoItem.Result> {
    const { todoItem, user } = params
    const insertTodoParams = { todoItem, user } as InsertOneTodoItemRespository.Params
    const newTodoItem = await this.insertTodoItemRepository.insertOne(insertTodoParams)
    return !!newTodoItem
  }
}
