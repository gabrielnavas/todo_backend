import { UserModelRepository } from '../models/user-model-repository'

export interface UserFindOneByEmailRepository {
  findByEmail(email: string): Promise<UserModelRepository>
}
