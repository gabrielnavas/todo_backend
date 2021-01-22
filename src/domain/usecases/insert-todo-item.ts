export interface InsertTodoItem {
  insertOne (params: InsertTodoItem.Params): Promise<InsertTodoItem.Result>
}

export namespace InsertTodoItem {
  type UserAccessParams = {
    token: string
  }
  type TodoItemParams = {
    idNameTodoArea: string,
    title: string,
    description: string
  }
  export type Params = {
    userAccess: UserAccessParams
    todoItem: TodoItemParams
  }

  export type Result = boolean
}
