import { Decrypter } from '@/data/interfaces/decrypter'
import { FindOneUserByIdRepository } from '@/data/interfaces/find-one-user-by-id-repository'
import { DbInsertTodoItem } from '@/data/usecases/db-insert-todo-item'

const makeDecrypter = (): Decrypter => {
  return new class DecrypterSpy implements Decrypter {
    async decrypt (ciphertext: string): Promise<string> {
      return 'any_decrypted_token'
    }
  }()
}

const makeFindOneUserById = (): FindOneUserByIdRepository => {
  return new class FindOneUserByIdSpy implements FindOneUserByIdRepository {
    async findOne (id: FindOneUserByIdRepository.Params): Promise<FindOneUserByIdRepository.Result> {
      return {
        id: 1,
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
  }()
}

type TypesSut = {
  sut: DbInsertTodoItem
  decrypterSpy: Decrypter
  findOneUserByIdSpy: FindOneUserByIdRepository

}

const makeSut = (): TypesSut => {
  const decrypterSpy = makeDecrypter()
  const findOneUserByIdSpy = makeFindOneUserById()
  const sut = new DbInsertTodoItem(decrypterSpy, findOneUserByIdSpy)
  return {
    sut,
    decrypterSpy,
    findOneUserByIdSpy
  }
}

describe('DbInsertTodoItem', () => {
  test('should call decryptor with correct user access token ', async () => {
    const { sut, decrypterSpy: decrypter } = makeSut()
    const decrypterSpy = jest.spyOn(decrypter, 'decrypt')
    const sutParams = {
      todoItem: { description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    await sut.insertOne(sutParams)
    expect(decrypterSpy).toHaveBeenCalledWith(sutParams.userAccess.token)
  })

  test('should return throw if decryptor token throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt')
      .mockRejectedValueOnce(new Error('any_error'))
    const sutParams = {
      todoItem: { description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    const promise = sut.insertOne(sutParams)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should call FindOneUserById with correct params ', async () => {
    const { sut, findOneUserByIdSpy: findOneUserById, decrypterSpy } = makeSut()
    const findOneUserByIdSpy = jest.spyOn(findOneUserById, 'findOne')
    const idUser = 1
    jest.spyOn(decrypterSpy, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(`${idUser}`))
    const sutParams = {
      todoItem: { description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    await sut.insertOne(sutParams)
    expect(findOneUserByIdSpy).toHaveBeenCalledWith(idUser)
  })

  test('should return null if FindOneUserById return null (user not found) ', async () => {
    const { sut, findOneUserByIdSpy, decrypterSpy } = makeSut()
    jest.spyOn(findOneUserByIdSpy, 'findOne').mockReturnValueOnce(null)
    const idUser = 1
    jest.spyOn(decrypterSpy, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(`${idUser}`))
    const sutParams = {
      todoItem: { description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    const insertOk = await sut.insertOne(sutParams)
    expect(insertOk).toBe(false)
  })

  test('should return throws if FindOneUserById throws ', () => {
    const { sut, findOneUserByIdSpy, decrypterSpy } = makeSut()
    jest.spyOn(findOneUserByIdSpy, 'findOne')
      .mockRejectedValueOnce(new Error('any_error'))
    const idUser = 1
    jest.spyOn(decrypterSpy, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(`${idUser}`))
    const sutParams = {
      todoItem: { description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    const promise = sut.insertOne(sutParams)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })
})
