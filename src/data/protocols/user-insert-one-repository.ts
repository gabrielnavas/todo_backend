import { UserModelRepository } from '../models/user-model-repository'

export type UserInsertOneRepositoryParams = {
  name: string
  email: string
  password: string
}

export interface UserInsertOneRepository {
  insertOne(params: UserInsertOneRepositoryParams): Promise<UserModelRepository>
}
