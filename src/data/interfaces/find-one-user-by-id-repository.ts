import { UserModelRepository } from '../models/user-model-repository'

export interface FindOneUserByIdRepository {
  findOne (id: FindOneUserByIdRepository.Params): Promise<FindOneUserByIdRepository.Result>
}

export namespace FindOneUserByIdRepository {
  export type Params = number
  export type Result = UserModelRepository
}
