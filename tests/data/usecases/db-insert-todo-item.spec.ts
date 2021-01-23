import { Decrypter } from '@/data/interfaces/decrypter'
import { FindOneUserByIdRepository } from '@/data/interfaces/find-one-user-by-id-repository'
import { InsertOneTodoItemRespository } from '@/data/interfaces/insert-one-todo-item-repository'
import { DbInsertTodoItem } from '@/data/usecases/db-insert-todo-item'

const makeDecrypter = (): Decrypter => {
  return new class DecrypterSpy implements Decrypter {
    async decrypt (ciphertext: string): Promise<Decrypter.ReturnType> {
      const payload = 'any_decrypted_token'
      return {
        issuedAt: 123,
        payload: payload
      }
    }
  }()
}

const makeFindOneUserById = (): FindOneUserByIdRepository => {
  return new class FindOneUserByIdSpy implements FindOneUserByIdRepository {
    async findOneById (id: FindOneUserByIdRepository.Params): Promise<FindOneUserByIdRepository.Result> {
      return {
        id: 1,
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
    }
  }()
}

const makeInsertOneTodoItemRespository = (): InsertOneTodoItemRespository => {
  return new class InsertOneTodoItemRespositorySpy implements InsertOneTodoItemRespository {
    async insertOne (params: InsertOneTodoItemRespository.Params): Promise<InsertOneTodoItemRespository.Result> {
      return {
        todoItem: {
          id: 1,
          idNameTodoArea: 'todo',
          title: 'any_title',
          description: 'any_descrption'
        },
        user: { id: 1 }
      }
    }
  }()
}

type TypesSut = {
  sut: DbInsertTodoItem
  decrypterSpy: Decrypter
  findOneUserByIdRepositorySpy: FindOneUserByIdRepository
  insertOneTodoItemRespositorySpy: InsertOneTodoItemRespository

}

const makeSut = (): TypesSut => {
  const decrypterSpy = makeDecrypter()
  const findOneUserByIdRepositorySpy = makeFindOneUserById()
  const insertOneTodoItemRespositorySpy = makeInsertOneTodoItemRespository()
  const sut = new DbInsertTodoItem(
    decrypterSpy,
    findOneUserByIdRepositorySpy,
    insertOneTodoItemRespositorySpy
  )
  return {
    sut,
    decrypterSpy,
    findOneUserByIdRepositorySpy,
    insertOneTodoItemRespositorySpy
  }
}

describe('DbInsertTodoItem', () => {
  test('should call decryptor with correct user access token ', async () => {
    const { sut, decrypterSpy: decrypter } = makeSut()
    const decrypterSpy = jest.spyOn(decrypter, 'decrypt')
    const sutParams = {
      todoItem: { idNameTodoArea: 'any_todo_area_id', description: 'any_description', title: 'any_title' },
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
      todoItem: { idNameTodoArea: 'any_todo_area_id', description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    const promise = sut.insertOne(sutParams)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should call FindOneUserByIdRepository with correct params ', async () => {
    const { sut, findOneUserByIdRepositorySpy: findOneUserByIdRepository, decrypterSpy } = makeSut()
    const findOneUserByIdRepositorySpy = jest.spyOn(findOneUserByIdRepository, 'findOneById')
    const idUser = 1
    jest.spyOn(decrypterSpy, 'decrypt')
      .mockReturnValueOnce(Promise.resolve({
        issuedAt: 123,
        payload: { id: 1 }
      }))
    const sutParams = {
      todoItem: { idNameTodoArea: 'any_todo_area_id', description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    await sut.insertOne(sutParams)
    expect(findOneUserByIdRepositorySpy).toHaveBeenCalledWith(idUser)
  })

  test('should return null if FindOneUserById return null (user not found) ', async () => {
    const { sut, findOneUserByIdRepositorySpy, decrypterSpy } = makeSut()
    jest.spyOn(findOneUserByIdRepositorySpy, 'findOneById').mockReturnValueOnce(null)
    const idUser = 1
    jest.spyOn(decrypterSpy, 'decrypt')
      .mockReturnValueOnce(Promise.resolve({
        issuedAt: 123,
        payload: { id: `${idUser}` }
      }))
    const sutParams = {
      todoItem: { idNameTodoArea: 'any_todo_area_id', description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    const insertOk = await sut.insertOne(sutParams)
    expect(insertOk).toBe(false)
  })

  test('should return throws if FindOneUserByIdRepository throws ', () => {
    const { sut, findOneUserByIdRepositorySpy, decrypterSpy } = makeSut()
    jest.spyOn(findOneUserByIdRepositorySpy, 'findOneById')
      .mockRejectedValueOnce(new Error('any_error'))
    const idUser = 1
    jest.spyOn(decrypterSpy, 'decrypt')
      .mockReturnValueOnce(Promise.resolve({
        issuedAt: 123,
        payload: { id: `${idUser}` }
      }))
    const sutParams = {
      todoItem: { idNameTodoArea: 'any_todo_area_id', description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    const promise = sut.insertOne(sutParams)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should call InsertTodoItemRepository with correct params', async () => {
    const {
      sut,
      findOneUserByIdRepositorySpy,
      insertOneTodoItemRespositorySpy: insertOneTodoItemRespository
    } = makeSut()
    jest.spyOn(findOneUserByIdRepositorySpy, 'findOneById')
      .mockReturnValueOnce(Promise.resolve({
        id: 1,
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      }))
    const insertOneTodoItemRespositorySpy =
      jest.spyOn(insertOneTodoItemRespository, 'insertOne')
    const sutParams = {
      todoItem: { idNameTodoArea: 'any_todo_area_id', description: 'any_description', title: 'any_title' },
      userAccess: { token: 'any_token' }
    }
    await sut.insertOne(sutParams)
    expect(insertOneTodoItemRespositorySpy)
      .toHaveBeenCalledWith({
        todoItem: {
          idNameTodoArea: 'any_todo_area_id',
          description: 'any_description',
          title: 'any_title'
        },
        user: {
          id: 1
        }
      })
  })

  test('should return throw if InsertTodoItemRepository throws', () => {
    const {
      sut,
      findOneUserByIdRepositorySpy,
      insertOneTodoItemRespositorySpy
    } = makeSut()
    jest.spyOn(findOneUserByIdRepositorySpy, 'findOneById')
      .mockReturnValueOnce(Promise.resolve({
        id: 1,
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      }))
    jest.spyOn(insertOneTodoItemRespositorySpy, 'insertOne')
      .mockRejectedValueOnce(new Error('any_error'))
    const sutParams = {
      todoItem: {
        idNameTodoArea: 'any_todo_area_id',
        description: 'any_description',
        title: 'any_title'
      },
      userAccess: {
        token: 'any_token'
      }
    }
    const promise = sut.insertOne(sutParams)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return true if InsertTodoItemRepository a todo item', async () => {
    const {
      sut,
      findOneUserByIdRepositorySpy
    } = makeSut()
    jest.spyOn(findOneUserByIdRepositorySpy, 'findOneById')
      .mockReturnValueOnce(Promise.resolve({
        id: 1,
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      }))

    const sutParams = {
      todoItem: {
        idNameTodoArea: 'any_todo_area_id',
        description: 'any_description',
        title: 'any_title'
      },
      userAccess: {
        token: 'any_token'
      }
    }
    const insertOk = await sut.insertOne(sutParams)
    expect(insertOk).toEqual(true)
  })
})
