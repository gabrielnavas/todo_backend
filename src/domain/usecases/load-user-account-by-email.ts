import { UserAccountModel } from '../models/user-account'

export interface LoadUserAccountByEmail {
  loadByEmail(params: LoadUserAccountByEmail.Params):
    Promise<LoadUserAccountByEmail.Result>
}

export namespace LoadUserAccountByEmail {
  export type Params = {
    email: string
  }

  export type Result = UserAccountModel
}
