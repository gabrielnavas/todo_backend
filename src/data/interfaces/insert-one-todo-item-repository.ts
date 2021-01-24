import { TodoItemModelRepository } from '../models/todo-item-model-repository'

export interface InsertOneTodoItemRepository {
  insertOne(params: InsertOneTodoItemRepository.Params): Promise<InsertOneTodoItemRepository.Result>
}

export namespace InsertOneTodoItemRepository {
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
