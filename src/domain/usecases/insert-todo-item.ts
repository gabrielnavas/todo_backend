export interface InsertTodoItem {
  insertOne (params: InsertTodoItem.Params): Promise<InsertTodoItem.Result>
}

export namespace InsertTodoItem {
  type UserParams = {
    id: number
  }
  type TodoItemParams = {
    idNameTodoArea: string,
    title: string,
    description: string
  }
  export type Params = {
    user: UserParams
    todoItem: TodoItemParams
  }

  export type Result = boolean
}
