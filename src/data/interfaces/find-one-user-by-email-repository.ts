import { UserModelRepository } from '@/data/models/user-model-repository'

export interface FindOneUserByEmailRepository {
  findOneByEmail(email: FindOneUserByEmailRepository.Params): Promise<FindOneUserByEmailRepository.Result>
}

export namespace FindOneUserByEmailRepository {
  export type Params = string
  export type Result = UserModelRepository
}
