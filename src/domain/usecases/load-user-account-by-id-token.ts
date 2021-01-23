import { UserAccountModel } from '../models/user-account'

export interface LoadUserAccountByIdAndToken {
  loadOneByIdAndToken(parasm: LoadUserAccountByIdAndToken.Params): Promise<LoadUserAccountByIdAndToken.Result>
}

export namespace LoadUserAccountByIdAndToken {
  export type Params = {
    idUser: number
    token: string,
  }
  export type Result = UserAccountModel
}
