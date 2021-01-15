import { UserModelRepository } from '../models/user-model-repository'

export interface InsertOneUserRepository {
  insertOne(params: InsertOneUserRepository.Params): Promise<InsertOneUserRepository.Result>
}

export namespace InsertOneUserRepository {

  export type Params = {
    name: string
    email: string
    password: string
  }

  export type Result = UserModelRepository
}
