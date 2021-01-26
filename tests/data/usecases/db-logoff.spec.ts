import {
  InvalidateOneUserTokenAccessByUserIdRepository
} from '../interfaces/invalidate-one-user-token-access-repository'
import { DbLogoff } from '@/data/usecases/db-logoff'

const makeUpdateOneUserTokenAccessRepository = ():
InvalidateOneUserTokenAccessByUserIdRepository => {
  class InvalidateOneUserTokenAccessByIdRepositorySpy
  implements InvalidateOneUserTokenAccessByUserIdRepository {
    async invalidateDateByUserId (params: InvalidateOneUserTokenAccessByUserIdRepository.Params):
      Promise<InvalidateOneUserTokenAccessByUserIdRepository.Result> {
      return {
        id: 1,
        token: 'any_token',
        createdAt: new Date(),
        invalidAt: undefined
      }
    }
  }
  return new InvalidateOneUserTokenAccessByIdRepositorySpy()
}

type TypesSut = {
  sut:DbLogoff
  updateOneUserTokenAccessRepositorySpy: InvalidateOneUserTokenAccessByUserIdRepository
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
    const updateOneUserTokenAccessRepositorySpy = jest.spyOn(updateOneUserTokenAccessRepository, 'invalidateDateByUserId')
    const sutParams = {
      userId: 1
    }
    await sut.logoff(sutParams)
    expect(updateOneUserTokenAccessRepositorySpy).toHaveBeenCalledWith(sutParams.userId)
  })

  test('should throws if InvalidateOneUserTokenAccessByIdRepository', async () => {
    const { sut, updateOneUserTokenAccessRepositorySpy } = makeSut()
    jest.spyOn(updateOneUserTokenAccessRepositorySpy, 'invalidateDateByUserId')
      .mockRejectedValueOnce(new Error())
    const sutParams = {
      userId: 1
    }
    const promise = sut.logoff(sutParams)
    expect(promise).rejects.toThrow()
  })

  test('should null if InvalidateOneUserTokenAccessByIdRepository returns null', async () => {
    const { sut, updateOneUserTokenAccessRepositorySpy } = makeSut()
    jest.spyOn(updateOneUserTokenAccessRepositorySpy, 'invalidateDateByUserId')
      .mockResolvedValueOnce(null)
    const sutParams = {
      userId: 1
    }
    const userTokenAcessModel = await sut.logoff(sutParams)
    expect(userTokenAcessModel).toEqual(userTokenAcessModel)
  })

  test('should return UserTokenAccessModel if InvalidateOneUserTokenAccessByIdRepository returns UserTokenAccessModelRepository', async () => {
    const { sut } = makeSut()
    const sutParams = {
      userId: 1
    }
    const resp = await sut.logoff(sutParams)
    expect(resp).toEqual(undefined)
  })
})
