import { Validation } from '@/validation/protocols/validation'
import { DbCreateUserAccount } from '@/data/usecases/db-create-user-account'
import { CreateUserAccount } from '@/domain/usecases/create-user-account'
import { FindOneUserByEmailRepository, InsertOneUserRepository } from '@/data/interfaces'
import { Hasher } from '@/data/interfaces/hasher'
import { ValidationSpy } from '../../mocks/mock-validation'

const makeUserRepository = () => {
  class UserRepositorySpy implements
    FindOneUserByEmailRepository,
    InsertOneUserRepository {
    async findByEmail (email: FindOneUserByEmailRepository.Params): Promise<FindOneUserByEmailRepository.Result> {
      return {
        id: 1,
        email: 'any_email',
        name: 'any_anme',
        password: 'any_password'
      }
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
  validationCompositeSpy: Validation
  hasherSpy: Hasher
  userRepositorySpy: (FindOneUserByEmailRepository & InsertOneUserRepository)
}

const makeSut = (): SutTypes => {
  const userRepositorySpy = makeUserRepository()
  const hasherSpy = makeHasherSpy()
  const validationCompositeSpy = new ValidationSpy()
  const sut = new DbCreateUserAccount(
    validationCompositeSpy,
    hasherSpy,
    userRepositorySpy,
    userRepositorySpy
  )
  return {
    sut,
    validationCompositeSpy,
    hasherSpy,
    userRepositorySpy
  }
}

describe('CreateUserAccount', () => {
  test('should calls validation with correct params', async () => {
    const { sut, validationCompositeSpy: validationComposite } = makeSut()
    const userParams = {
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    }
    const validationCompositeSpy = jest.spyOn(validationComposite, 'validate')
    await sut.createUser(userParams)
    expect(validationCompositeSpy).toHaveBeenCalledWith(userParams)
  })

  test('should return throw if validation throws', async () => {
    const { sut, validationCompositeSpy: validationComposite } = makeSut()
    jest.spyOn(validationComposite, 'validate').mockImplementationOnce(() => {
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

  test('should return a errors if validator return errors', async () => {
    const { sut, validationCompositeSpy } = makeSut()
    const error = new Error('name is small')
    jest.spyOn(validationCompositeSpy, 'validate').mockReturnValueOnce(error)
    const userParams = {
      email: 'any_email',
      name: 'ga',
      password: 'any_password'
    }
    const result = await sut.createUser(userParams)
    expect(result).toBe(null)
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

  test('should return null of FindOneUserByEmailRepository if email exists', async () => {
    const { sut, userRepositorySpy: userRepository } = makeSut()
    jest.spyOn(userRepository, 'findByEmail').mockReturnValueOnce(null)
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
