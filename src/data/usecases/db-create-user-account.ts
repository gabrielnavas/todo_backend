import { CreateUserAccount } from '@/domain/usecases/create-user-account'
import { Validation } from '@/validation/protocols/validation'
import { FindOneUserByEmailRepository, InsertOneUserRepository } from '../interfaces'
import { Hasher } from '../interfaces/hasher'

export class DbCreateUserAccount implements CreateUserAccount {
  constructor (
    private readonly hasherPasswordParam: Hasher,
    private readonly checkEmailExists: FindOneUserByEmailRepository,
    private readonly createNewUser: InsertOneUserRepository
  ) {}

  createUser = async (params: CreateUserAccount.Params): Promise<CreateUserAccount.Result> => {
    const userFound = await this.checkEmailExists.findByEmail(params.email)
    if (!userFound) return null
    const passwordHashed = await this.hasherPasswordParam.hash(params.password)
    const user = await this.createNewUser.insertOne({ ...params, password: passwordHashed })
    return !!user
  }
}
