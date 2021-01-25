export interface DeleteOneTodoItemRepository {
  deleteOne(id: DeleteOneTodoItemRepository.Params): Promise<DeleteOneTodoItemRepository.Result>
}

export namespace DeleteOneTodoItemRepository {
  export type Params = number
  export type Result = boolean
}
