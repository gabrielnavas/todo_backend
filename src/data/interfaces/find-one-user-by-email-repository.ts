import { UserModelRepository } from '@/data/models/user-model-repository'

export interface FindOneUserByEmailRepository {
  findByEmail(email: FindOneUserByEmailRepository.Params): Promise<FindOneUserByEmailRepository.Result>
}

export namespace FindOneUserByEmailRepository {
  export type Params = string
  export type Result = UserModelRepository
}
