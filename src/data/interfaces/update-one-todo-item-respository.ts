import { TodoItemModelRepository } from '../models/todo-item-model-repository'

export interface UpdateOneTodoItemRespository {
  updateOne(params: UpdateOneTodoItemRespository.Params): Promise<UpdateOneTodoItemRespository.Result>
}

export namespace UpdateOneTodoItemRespository {
  export type Params = {
    todoItem: TodoItemModelRepository,
    user: {
      id: number
    }
  }
  export type Result = TodoItemModelRepository
}
