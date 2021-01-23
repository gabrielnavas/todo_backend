import { TodoItemModel } from '../models/todo-item'

export interface UpdateTodoItem {
  updateOne (params: UpdateTodoItem.Params): Promise<UpdateTodoItem.Result>
}

export namespace UpdateTodoItem {
  type UserParams = {
    id: number
  }

  export type Params = {
    user: UserParams
    todoItem: TodoItemModel
  }

  export type Result = boolean
}
