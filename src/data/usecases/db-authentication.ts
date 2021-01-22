import { Authentication } from '@/domain/usecases/authentication'
import { FindOneUserByEmailRepository } from '../interfaces'
import { Encrypter } from '../interfaces/encrypter'
import { HashComparer } from '../interfaces/hasher-comparer'
import { InsertOneUserTokenAccessRepository } from '../interfaces/insert-one-user-token-access-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly checkExistsUserByEmail: FindOneUserByEmailRepository,
    private readonly checkPasswordsHashs: HashComparer,
    private readonly createToken: Encrypter,
    private readonly insertToken: InsertOneUserTokenAccessRepository
  ) {}

  authenticate = async (params: Authentication.Params): Promise<Authentication.Result> => {
    const userModelFound = await this.checkExistsUserByEmail.findOneByEmail(params.email)
    if (!userModelFound) return null
    const isPasswordsEquals = await this.checkPasswordsHashs.compare(params.password, userModelFound.password)
    if (!isPasswordsEquals) return null
    const token = await this.createToken.encrypt(`${userModelFound.id}`)
    const insertResp = await this.insertToken.insertOne({ idUser: userModelFound.id, token })
    return {
      token: insertResp.token,
      userName: userModelFound.name,
      email: userModelFound.email
    }
  }
}
