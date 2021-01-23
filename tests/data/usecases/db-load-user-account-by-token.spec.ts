import { FindOneUserByIdAndTokenRepository } from '@/data/interfaces/find-one-user-by-id-token-repository'
import { DbLoadUserAccountByToken } from '@/data/usecases/db-load-user-account-by-id-token'

const makeFindOneUserByTokenRepository = (): FindOneUserByIdAndTokenRepository => {
  return new class UserRepositorySpy implements FindOneUserByIdAndTokenRepository {
    async findOneByIdAndToken (token: FindOneUserByIdAndTokenRepository.Params): Promise<FindOneUserByIdAndTokenRepository.Result> {
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
  findOneUserByTokenRepositorySpy: FindOneUserByIdAndTokenRepository
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
      .spyOn(findOneUserByTokenRepository, 'findOneByIdAndToken')
    await sut.loadOneByIdAndToken({ idUser: 1, token: 'any_token' })
    expect(findOneUserByTokenRepositorySpy).toHaveBeenCalledWith({
      idUser: 1,
      token: 'any_token'
    })
  })

  test('should return throw if FindOneUserByTokenRepository throws', () => {
    const { sut, findOneUserByTokenRepositorySpy } = makeSut()
    jest.spyOn(findOneUserByTokenRepositorySpy, 'findOneByIdAndToken')
      .mockRejectedValueOnce(new Error('any_error'))
    const promise = sut.loadOneByIdAndToken({ idUser: 1, token: 'any_token' })
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return null if FindOneUserByTokenRepository returns null', async () => {
    const { sut, findOneUserByTokenRepositorySpy } = makeSut()
    jest.spyOn(findOneUserByTokenRepositorySpy, 'findOneByIdAndToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const userAccount = await sut.loadOneByIdAndToken({
      idUser: 1,
      token: 'any_token'
    })
    expect(userAccount).toEqual(null)
  })
})
