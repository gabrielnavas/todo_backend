import { UserTokenAccessModelRepository } from '../models/user-token-access-model-repository'

export interface InvalidateOneUserTokenAccessByIdRepository {
  invalidateDateById(id: InvalidateOneUserTokenAccessByIdRepository.Params): Promise<InvalidateOneUserTokenAccessByIdRepository.Result>
}

export namespace InvalidateOneUserTokenAccessByIdRepository {
  export type Params = number
  export type Result = UserTokenAccessModelRepository
}
