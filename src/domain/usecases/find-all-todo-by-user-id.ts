import { TodoItemModel } from '../models/todo-item'

export interface FindAllTodoItemsByUserId {
  findAllByUserId (userId: FindAllTodoItemsByUserId.Params): Promise<FindAllTodoItemsByUserId.Result>
}

export namespace FindAllTodoItemsByUserId {
export type Params = number
export type Result = TodoItemModel[][]
}
