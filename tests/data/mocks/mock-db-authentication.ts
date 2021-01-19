import { Encrypter, FindOneUserByEmailRepository, HashComparer, InsertOneUserTokenAccessRepository } from '@/data/interfaces'
import { DbAuthentication } from '@/data/usecases/db-authentication'
import { Authentication } from '@/domain/usecases/authentication'

const userName = 'any_name'
const token = 'any_token'

const makeUserRepository = () => {
  class UserRepositorySpy implements FindOneUserByEmailRepository {
    async findByEmail (email: FindOneUserByEmailRepository.Params): Promise<FindOneUserByEmailRepository.Result> {
      return {
        id: 1,
        email: 'any_email',
        name: userName,
        password: 'any_password_hashed'
      }
    }
  }
  return new UserRepositorySpy()
}

const makeInsertOneUserTokenAccess = (): InsertOneUserTokenAccessRepository => {
  class InsertOneUserTokenAccessSpy implements InsertOneUserTokenAccessRepository {
    insertOne = async (params: InsertOneUserTokenAccessRepository.Params): Promise<InsertOneUserTokenAccessRepository.Result> => {
      return {
        id: 1,
        createdAt: new Date(),
        token
      }
    }
  }
  return new InsertOneUserTokenAccessSpy()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerSpy implements HashComparer {
    compare = async (plaitext: string, digest: string): Promise<boolean> => {
      return true
    }
  }
  return new HashComparerSpy()
}

const makeEncrypter = () => {
  class EncrypterSpy implements Encrypter {
    encrypt = async (plaintext: string): Promise<string> => {
      return token
    }
  }
  return new EncrypterSpy()
}

type TypeSut = {
  checkExistsUserByEmailSpy: FindOneUserByEmailRepository
  hashComparerSpy: HashComparer
  encrypterSpy: Encrypter
  insertOneUserTokenAccessSpy: InsertOneUserTokenAccessRepository
  sut: Authentication
  variables: {userName: string, token: string}
}

export const makeAuthenticationMock = (): TypeSut => {
  const insertOneUserTokenAccessSpy = makeInsertOneUserTokenAccess()
  const checkExistsUserByEmailSpy = makeUserRepository()
  const hashComparerSpy = makeHashComparer()
  const encrypterSpy = makeEncrypter()
  const sut = new DbAuthentication(
    checkExistsUserByEmailSpy,
    hashComparerSpy,
    encrypterSpy,
    insertOneUserTokenAccessSpy
  )
  return {
    sut,
    checkExistsUserByEmailSpy,
    hashComparerSpy,
    encrypterSpy,
    insertOneUserTokenAccessSpy,
    variables: { userName, token }
  }
}
