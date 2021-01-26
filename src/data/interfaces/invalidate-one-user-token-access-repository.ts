import { UserTokenAccessModelRepository } from '../models/user-token-access-model-repository'

export interface InvalidateOneUserTokenAccessByUserIdRepository {
  invalidateDateByUserId(idUser: InvalidateOneUserTokenAccessByUserIdRepository.Params): Promise<InvalidateOneUserTokenAccessByUserIdRepository.Result>
}

export namespace InvalidateOneUserTokenAccessByUserIdRepository {
  export type Params = number
  export type Result = UserTokenAccessModelRepository
}
