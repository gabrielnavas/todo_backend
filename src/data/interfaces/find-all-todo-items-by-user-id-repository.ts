import { TodoItemModelRepository } from '../models/todo-item-model-repository'

export interface FindAllTodoItemsByUserIdRepository {
  findAllByUserId (userId: FindAllTodoItemsByUserIdRepository.Params):
    Promise<FindAllTodoItemsByUserIdRepository.Result>
}

export namespace FindAllTodoItemsByUserIdRepository {
  type TodoItemMRepositoryWithUserId = (
    TodoItemModelRepository & {userId: number}
  )[]
  export type Params = number
  export type Result = TodoItemMRepositoryWithUserId
}
