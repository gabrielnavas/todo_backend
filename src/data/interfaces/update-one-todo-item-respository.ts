import { TodoItemModelRepository } from '../models/todo-item-model-repository'

export interface UpdateOneTodoItemRespository {
  updateOne(params: UpdateOneTodoItemRespository.Params): Promise<UpdateOneTodoItemRespository.Result>
}

export namespace UpdateOneTodoItemRespository {
  type TodoItemOnUpdate = {
    todoItem: TodoItemModelRepository,
    user: {
      id: number
    }
  }
  export type Params = TodoItemOnUpdate
  export type Result = TodoItemOnUpdate
}
