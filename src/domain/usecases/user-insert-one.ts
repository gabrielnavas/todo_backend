import { UserModel } from 'domain/models/user'

export type UserInsertOneParams = {
 name: string
 email: string
 password: string
}

export interface UserInsertOne {
  insert(params: UserInsertOneParams): Promise<UserModel>
}
