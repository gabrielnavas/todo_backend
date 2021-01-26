import { InvalidateOneUserTokenAccessByIdRepository }
  from '../interfaces/invalidate-one-user-token-access-repository'
import { DbLogoff } from '@/data/usecases/db-logoff'

const makeUpdateOneUserTokenAccessRepository = (): InvalidateOneUserTokenAccessByIdRepository => {
  return new class InvalidateOneUserTokenAccessByIdRepositorySpy implements InvalidateOneUserTokenAccessByIdRepository {
    async invalidateDateById (params: InvalidateOneUserTokenAccessByIdRepository.Params): Promise<InvalidateOneUserTokenAccessByIdRepository.Result> {
      return {
        id: 1,
        token: 'any_token',
        createdAt: new Date(),
        invalidAt: undefined
      }
    }
  }()
}

type TypesSut = {
  sut:DbLogoff
  updateOneUserTokenAccessRepositorySpy: InvalidateOneUserTokenAccessByIdRepository
}

const makeSut = (): TypesSut => {
  const updateOneUserTokenAccessRepositorySpy = makeUpdateOneUserTokenAccessRepository()
  const sut = new DbLogoff(
    updateOneUserTokenAccessRepositorySpy
  )
  return {
    sut,
    updateOneUserTokenAccessRepositorySpy
  }
}

describe('DbLogoff', () => {
  test('should call InvalidateOneUserTokenAccessByIdRepository with correct params', async () => {
    const { sut, updateOneUserTokenAccessRepositorySpy: updateOneUserTokenAccessRepository } = makeSut()
    const updateOneUserTokenAccessRepositorySpy = jest.spyOn(updateOneUserTokenAccessRepository, 'invalidateDateById')
    const sutParams = {
      idUserToken: 1
    }
    await sut.logoff(sutParams)
    expect(updateOneUserTokenAccessRepositorySpy).toHaveBeenCalledWith(sutParams.idUserToken)
  })

  test('should throws if InvalidateOneUserTokenAccessByIdRepository', async () => {
    const { sut, updateOneUserTokenAccessRepositorySpy } = makeSut()
    jest.spyOn(updateOneUserTokenAccessRepositorySpy, 'invalidateDateById')
      .mockRejectedValueOnce(new Error())
    const sutParams = {
      idUserToken: 1
    }
    const promise = sut.logoff(sutParams)
    expect(promise).rejects.toThrow()
  })

  test('should null if InvalidateOneUserTokenAccessByIdRepository returns null', async () => {
    const { sut, updateOneUserTokenAccessRepositorySpy } = makeSut()
    jest.spyOn(updateOneUserTokenAccessRepositorySpy, 'invalidateDateById')
      .mockResolvedValueOnce(null)
    const sutParams = {
      idUserToken: 1
    }
    const userTokenAcessModel = await sut.logoff(sutParams)
    expect(userTokenAcessModel).toEqual(userTokenAcessModel)
  })

  test('should user token acess model if InvalidateOneUserTokenAccessByIdRepository returns user token acess model', async () => {
    const { sut } = makeSut()
    const sutParams = {
      idUserToken: 1
    }
    const userTokenAcessModel = await sut.logoff(sutParams)
    expect(userTokenAcessModel).toEqual(userTokenAcessModel)
  })
})
