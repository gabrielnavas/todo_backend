import { UserModelRepository } from '../models/user-model-repository'

export interface FindOneUserByTokenRepository {
  findOneByToken(token: FindOneUserByTokenRepository.Params): Promise<FindOneUserByTokenRepository.Result>
}

export namespace FindOneUserByTokenRepository {
  export type Params = string
  export type Result = UserModelRepository
}
