import { DbCreateUserAccount } from '@/data/usecases/db-create-user-account'
import { CreateUserAccount } from '@/domain/usecases/create-user-account'
import { FindOneUserByEmailRepository, InsertOneUserRepository } from '@/data/interfaces'
import { Hasher } from '@/data/interfaces/hasher'

const makeUserRepository = () => {
  class UserRepositorySpy implements
    FindOneUserByEmailRepository,
    InsertOneUserRepository {
    async findByEmail (email: FindOneUserByEmailRepository.Params): Promise<FindOneUserByEmailRepository.Result> {
      return null
    }

    async insertOne (params: InsertOneUserRepository.Params): Promise<InsertOneUserRepository.Result> {
      return {
        id: 1,
        email: 'any_email',
        name: 'any_anme',
        password: 'any_password'
      }
    }
  }
  return new UserRepositorySpy()
}

const passwordHashed = 'any_password_hash'

const makeHasherSpy = (): Hasher => {
  class HasherSpy implements Hasher {
    async hash (plaintext: Hasher.Params): Promise<Hasher.Result> {
      return passwordHashed
    }
  }
  return new HasherSpy()
}

interface SutTypes {
  sut: CreateUserAccount
  hasherSpy: Hasher
  userRepositorySpy: (FindOneUserByEmailRepository & InsertOneUserRepository)
}

const makeSut = (): SutTypes => {
  const userRepositorySpy = makeUserRepository()
  const hasherSpy = makeHasherSpy()
  const sut = new DbCreateUserAccount(
    hasherSpy,
    userRepositorySpy,
    userRepositorySpy
  )
  return {
    sut,
    hasherSpy,
    userRepositorySpy
  }
}

describe('CreateUserAccount', () => {
  test('should call hasher with correct password', async () => {
    const { sut, hasherSpy: hasher } = makeSut()
    const hasherSpy = jest.spyOn(hasher, 'hash')
    const userParams = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    }
    await sut.createUser(userParams)
    expect(hasherSpy).toHaveBeenCalledWith(userParams.password)
  })

  test('should call hasher with correct password', async () => {
    const { sut, hasherSpy: hasher } = makeSut()
    const hasherSpy = jest.spyOn(hasher, 'hash')
    const userParams = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    }
    await sut.createUser(userParams)
    expect(hasherSpy).toHaveBeenCalledWith(userParams.password)
  })

  test('should return throw if hasher throws', async () => {
    const { sut, hasherSpy: hasher } = makeSut()
    jest.spyOn(hasher, 'hash').mockRejectedValueOnce(new Error())
    const userParams = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    }
    const promise = sut.createUser(userParams)
    expect(promise).rejects.toThrow()
  })

  test('should call FindOneUserByEmailRepository with correct params', async () => {
    const { sut, userRepositorySpy: userRepository } = makeSut()
    const userRepositorySpy = jest.spyOn(userRepository, 'findByEmail')
    const userParams = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    }
    await sut.createUser(userParams)
    expect(userRepositorySpy).toHaveBeenCalledWith(userParams.email)
  })

  test('should return throw if FindOneUserByEmailRepository with correct params', async () => {
    const { sut, userRepositorySpy: userRepository } = makeSut()
    jest.spyOn(userRepository, 'findByEmail').mockImplementationOnce(() => {
      throw new Error()
    })
    const userParams = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    }
    const promise = sut.createUser(userParams)
    expect(promise).rejects.toThrow()
  })

  test('should return null if email exists', async () => {
    const { sut, userRepositorySpy: userRepository } = makeSut()
    jest.spyOn(userRepository, 'findByEmail').mockImplementationOnce(async () => {
      return Promise.resolve({
        id: 1,
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      })
    })
    const userParams = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    }
    const result = await sut.createUser(userParams)
    expect(result).toBe(null)
  })

  test('should calls InsertOneUserRepository with correct params', async () => {
    const { sut, userRepositorySpy: userRepository } = makeSut()
    const userRepositorySpy = jest.spyOn(userRepository, 'insertOne')
    const userParams = {
      email: 'any_email',
      name: 'any_name',
      password: passwordHashed
    }
    await sut.createUser(userParams)
    expect(userRepositorySpy).toHaveBeenCalledWith(userParams)
  })
})
