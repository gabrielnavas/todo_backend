export interface DeleteTodoItem {
  deleteOne (id: DeleteTodoItem.Params): Promise<DeleteTodoItem.Result>
}

export namespace DeleteTodoItem {
  export type Params = number
  export type Result = boolean
}
