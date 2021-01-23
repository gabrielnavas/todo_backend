import { InsertTodoItem } from '@/domain/usecases/insert-todo-item'
import { Decrypter } from '../interfaces/decrypter'
import { FindOneUserByIdRepository } from '../interfaces/find-one-user-by-id-repository'
import { InsertOneTodoItemRespository } from '../interfaces/insert-one-todo-item-repository'

export class DbInsertTodoItem implements InsertTodoItem {
  constructor (
    private readonly decrypterToken: Decrypter,
    private readonly verifyIfUserExists: FindOneUserByIdRepository,
    private readonly insertTodoItem: InsertOneTodoItemRespository
  ) {}

  async insertOne (params: InsertTodoItem.Params): Promise<InsertTodoItem.Result> {
    const { payload } = await this.decrypterToken.decrypt(params.userAccess.token)
    const userFound = await this.verifyIfUserExists.findOneById(payload.id)
    if (!userFound) return false
    const insertTodoParams = {
      todoItem: params.todoItem,
      user: { id: userFound.id }
    } as InsertOneTodoItemRespository.Params
    const newTodoItem = await this.insertTodoItem.insertOne(insertTodoParams)
    return !!newTodoItem
  }
}
