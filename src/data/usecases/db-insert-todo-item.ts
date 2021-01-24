import { InsertTodoItem } from '@/domain/usecases/insert-todo-item'
import { InsertOneTodoItemRepository } from '../interfaces/insert-one-todo-item-repository'

export class DbInsertTodoItem implements InsertTodoItem {
  constructor (
    private readonly insertTodoItemRepository: InsertOneTodoItemRepository
  ) {}

  async insertOne (params: InsertTodoItem.Params): Promise<InsertTodoItem.Result> {
    const { todoItem, user } = params
    const insertTodoParams = { todoItem, user } as InsertOneTodoItemRepository.Params
    const newTodoItem = await this.insertTodoItemRepository.insertOne(insertTodoParams)
    return newTodoItem
  }
}
