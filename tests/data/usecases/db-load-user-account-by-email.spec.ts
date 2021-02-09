import { LoadUserAccountByEmail } from '@/domain/usecases/load-user-account-by-email'
import { FindOneUserByEmailRepository } from '../interfaces'
import { DbLoadUserAccountByEmail } from '@/data/usecases/db-load-user-account-by-email'

const makeUserRepository = () => {
  class UserRepositorySpy implements FindOneUserByEmailRepository {
    async findOneByEmail (email: FindOneUserByEmailRepository.Params):
      Promise<FindOneUserByEmailRepository.Result> {
      return {
        id: 1,
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      }
    }
  }
  return new UserRepositorySpy()
}

interface SutTypes {
  sut: LoadUserAccountByEmail
  userRepositorySpy: FindOneUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const userRepositorySpy = makeUserRepository()
  const sut = new DbLoadUserAccountByEmail(userRepositorySpy)
  return {
    sut,
    userRepositorySpy
  }
}

describe('DbLoadUserAccountByEmail', () => {
  test('should call FindOneUserByEmailRepository with correct params', async () => {
    const { sut, userRepositorySpy: userRepository } = makeSut()
    const userRepositorySpy = jest.spyOn(userRepository, 'findOneByEmail')
    const userParams = {
      email: 'any_email'
    }
    await sut.loadByEmail({ email: userParams.email })
    expect(userRepositorySpy).toHaveBeenCalledWith(userParams.email)
  })

  test('should return throw if FindOneUserByEmailRepository with correct params', () => {
    const { sut, userRepositorySpy: userRepository } = makeSut()
    jest.spyOn(userRepository, 'findOneByEmail').mockImplementationOnce(() => {
      throw new Error()
    })
    const userParams = {
      email: 'any_email'
    }
    const promise = sut.loadByEmail({ email: userParams.email })
    expect(promise).rejects.toThrow()
  })

  test('should return null if email exists', async () => {
    const { sut, userRepositorySpy: userRepository } = makeSut()
    jest.spyOn(userRepository, 'findOneByEmail').mockImplementationOnce(async () => {
      return Promise.resolve(null)
    })
    const userParams = {
      email: 'any_email'
    }
    const userModel = await sut.loadByEmail({ email: userParams.email })
    expect(userModel).toBe(null)
  })
})
