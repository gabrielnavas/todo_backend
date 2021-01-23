import { UserModelRepository } from '../models/user-model-repository'

export interface FindOneUserByIdAndTokenRepository {
  findOneByIdAndToken(params: FindOneUserByIdAndTokenRepository.Params): Promise<FindOneUserByIdAndTokenRepository.Result>
}

export namespace FindOneUserByIdAndTokenRepository {
  export type Params = {
    idUser: number,
    token: string
  }
  export type Result = UserModelRepository
}
