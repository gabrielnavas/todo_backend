import { FindOneUserByTokenRepository } from '@/data/interfaces/find-one-user-by-token-repository'
import { DbLoadUserAccountByToken } from '@/data/usecases/db-load-user-account-by-token'

const makeFindOneUserByTokenRepository = (): FindOneUserByTokenRepository => {
  return new class UserRepositorySpy implements FindOneUserByTokenRepository {
    async findOneByToken (token: FindOneUserByTokenRepository.Params): Promise<FindOneUserByTokenRepository.Result> {
      return {
        id: 1,
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
  }()
}

type SutTypes = {
  sut: DbLoadUserAccountByToken
  findOneUserByTokenRepositorySpy: FindOneUserByTokenRepository
}

const makeSut = (): SutTypes => {
  const findOneUserByTokenRepositorySpy = makeFindOneUserByTokenRepository()
  const sut = new DbLoadUserAccountByToken(findOneUserByTokenRepositorySpy)
  return {
    sut,
    findOneUserByTokenRepositorySpy
  }
}

describe('DbLoadUserAccountByToken', () => {
  test('should call FindOneUserByTokenRepository with correct params', async () => {
    const { sut, findOneUserByTokenRepositorySpy: findOneUserByTokenRepository } = makeSut()
    const findOneUserByTokenRepositorySpy = jest
      .spyOn(findOneUserByTokenRepository, 'findOneByToken')
    await sut.loadOneByToken('any_token')
    expect(findOneUserByTokenRepositorySpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if FindOneUserByTokenRepository throws', () => {
    const { sut, findOneUserByTokenRepositorySpy } = makeSut()
    jest.spyOn(findOneUserByTokenRepositorySpy, 'findOneByToken')
      .mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.loadOneByToken('any_token')
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return null if FindOneUserByTokenRepository returns null', async () => {
    const { sut, findOneUserByTokenRepositorySpy } = makeSut()
    jest.spyOn(findOneUserByTokenRepositorySpy, 'findOneByToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const userAccount = await sut.loadOneByToken('any_token')
    expect(userAccount).toEqual(null)
  })
})
