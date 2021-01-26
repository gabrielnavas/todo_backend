import { Logoff } from '@/domain/usecases/logoff'
import { InvalidateOneUserTokenAccessByUserIdRepository } from '../interfaces/invalidate-one-user-token-access-repository'

export class DbLogoff implements Logoff {
  constructor (
    private readonly invalidateOneUserTokenAccessRepository: InvalidateOneUserTokenAccessByUserIdRepository
  ) { }

  async logoff (params: Logoff.Params): Promise<Logoff.Result> {
    await this.invalidateOneUserTokenAccessRepository.invalidateDateByUserId(params.userId)
  }
}
