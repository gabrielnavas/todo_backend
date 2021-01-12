import validator from 'validator'
import bcrypt from 'bcrypt'
import { UserModel } from 'domain/models/user'
import { UserInsertOne, UserInsertOneParams } from '../../domain/usecases/user-insert-one'
import { UserInsertOneRepository } from 'data/protocols/user-insert-one-repository'
import { UserFindOneByEmailRepository } from 'data/protocols/user-find-one-by-email-repository'

export class DbUserInsertOne implements UserInsertOne {
  constructor (
    private readonly userRepository: UserInsertOneRepository & UserFindOneByEmailRepository
  ) {}

  insert = async (params: UserInsertOneParams): Promise<UserModel> => {
    const { email, name, password } = params
    if (!validator.isEmail(email)) return null
    if (name.length < 3 || name.length > 30) return null
    if (password.length < 3 || password.length > 30) return null
    if (!this.userRepository.findByEmail(email)) return null
    const salt = 12
    const passwordHashed = await bcrypt.hash(password, salt)
    const useMRepository = this.userRepository.insertOne({ email, name, password: passwordHashed })
    return useMRepository
  }
}
