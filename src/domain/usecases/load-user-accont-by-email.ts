import { UserAccountModel } from '../models/user-account'

export interface LoadUserAccontByEmail {
  loadByEmail(params: LoadUserAccontByEmail.Params):
    Promise<LoadUserAccontByEmail.Result>
}

export namespace LoadUserAccontByEmail {
  export type Params = {
    email: string
  }

  export type Result = UserAccountModel
}
