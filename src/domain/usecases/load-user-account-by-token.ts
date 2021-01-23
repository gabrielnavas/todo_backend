import { UserAccountModel } from '../models/user-account'

export interface LoadUserAccountByToken {
  loadOneByToken(parasm: LoadUserAccountByToken.Params): Promise<LoadUserAccountByToken.Result>
}

export namespace LoadUserAccountByToken {
  export type Params = string
  export type Result = UserAccountModel
}
