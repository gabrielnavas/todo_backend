export interface CreateUserAccount {
  createUser(params: CreateUserAccount.Params): Promise<CreateUserAccount.Result>
}

export namespace CreateUserAccount{
  export type Params = {
    name: string
    email: string
    password: string
  }
  export type Result = Boolean
}
