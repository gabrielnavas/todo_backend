import { TodoItemModelRepository } from '../models/todo-item-model-repository'

export interface InsertOneTodoItemRespository {
  insertOne(params: InsertOneTodoItemRespository.Params): Promise<InsertOneTodoItemRespository.Result>
}

export namespace InsertOneTodoItemRespository {
  export type Params = {
    todoItem: {
      idNameTodoArea: string
      description: string
      title: string
    },
    user: {
      id: number
    }
  }
  export type Result = {
    todoItem: TodoItemModelRepository,
    user: {
      id: number
    }
  }
}
