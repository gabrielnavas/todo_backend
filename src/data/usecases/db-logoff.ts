import { Logoff } from '@/domain/usecases/logoff'
import { InvalidateOneUserTokenAccessByIdRepository } from '../interfaces/invalidate-one-user-token-access-repository'

export class DbLogoff implements Logoff {
  constructor (
    private readonly invalidateOneUserTokenAccessRepository: InvalidateOneUserTokenAccessByIdRepository
  ) { }

  async logoff (params: Logoff.Params): Promise<Logoff.Result> {
    const userTokenAccessModel = await this.invalidateOneUserTokenAccessRepository.invalidateDateById(params.idUserToken)
    return userTokenAccessModel
  }
}
