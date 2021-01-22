import { UserModelRepository } from '../models/user-model-repository'

export interface FindOneUserByIdRepository {
  findOneById (id: FindOneUserByIdRepository.Params): Promise<FindOneUserByIdRepository.Result>
}

export namespace FindOneUserByIdRepository {
  export type Params = number
  export type Result = UserModelRepository
}
