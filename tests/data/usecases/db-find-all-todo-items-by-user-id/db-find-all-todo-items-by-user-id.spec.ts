import { FindAllTodoItemsByUserIdRepository } from '../../interfaces/find-all-todo-items-by-user-id-repository'
import { makeMatrixClassication, makeTodoItemsListWithRandomTodoAreas } from '../../mocks/mock-db-find-all-todo-items-by-user-id'
import { TodoItemModelRepository } from '../../models/todo-item-model-repository'
import { DbFindAllTodoItemsByUserId } from '@/data/usecases/db-find-all-todo-items-by-user-id'
import { MatrixClassification } from '../../interfaces/matrix-classification'

const todoItemsList = makeTodoItemsListWithRandomTodoAreas()

const makeFindAllTodoItemsByUserIdRepository = (): FindAllTodoItemsByUserIdRepository => {
  class FindAllTodoItemsByUserIdRepositorySpy implements FindAllTodoItemsByUserIdRepository {
    findAllByUserId (userId: number): Promise<TodoItemModelRepository[]> {
      return Promise.resolve(todoItemsList)
    }
  }
  return new FindAllTodoItemsByUserIdRepositorySpy()
}

type SutTypes = {
  sut: DbFindAllTodoItemsByUserId
  findAllTodoItemsByUserIdRepositorySpy: FindAllTodoItemsByUserIdRepository
  matrixClassicationSpy: MatrixClassification
}

const makeSut = (): SutTypes => {
  const findAllTodoItemsByUserIdRepositorySpy = makeFindAllTodoItemsByUserIdRepository()
  const matrixClassicationSpy = makeMatrixClassication()
  const sut = new DbFindAllTodoItemsByUserId(
    findAllTodoItemsByUserIdRepositorySpy,
    matrixClassicationSpy
  )
  return {
    sut,
    findAllTodoItemsByUserIdRepositorySpy,
    matrixClassicationSpy
  }
}

describe('DbFindAllTodoItemsByUserId', () => {
  test('should call DbFindAllTodoItemsByUserIdRepository with correct params', async () => {
    const { sut, findAllTodoItemsByUserIdRepositorySpy: findAllTodoItemsByUserIdRepository } = makeSut()
    const findAllTodoItemsByUserIdRepositorySpy = jest.spyOn(
      findAllTodoItemsByUserIdRepository,
      'findAllByUserId'
    )
    const userIdParam = 1
    await sut.findAllByUserId(userIdParam)
    expect(findAllTodoItemsByUserIdRepositorySpy).toHaveBeenCalledWith(userIdParam)
  })

  test('should return throw if DbFindAllTodoItemsByUserIdRepository throws', () => {
    const { sut, findAllTodoItemsByUserIdRepositorySpy } = makeSut()
    jest.spyOn(findAllTodoItemsByUserIdRepositorySpy, 'findAllByUserId')
      .mockRejectedValue(new Error('any_error'))
    const userIdParam = 1
    const promise = sut.findAllByUserId(userIdParam)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should call matrixClassification with correct params', async () => {
    const { sut, matrixClassicationSpy: matrixClassication } = makeSut()
    const matrixClassicationSpy = jest.spyOn(matrixClassication, 'addList')
    const userIdParam = 1
    await sut.findAllByUserId(userIdParam)
    expect(matrixClassicationSpy).toHaveBeenCalledWith(makeTodoItemsListWithRandomTodoAreas())
  })

  test('should return an matrix list if ok', async () => {
    const { sut } = makeSut()
    const userIdParam = 1
    const todoItemsList = await sut.findAllByUserId(userIdParam)
    expect(todoItemsList).toEqual(makeMatrixClassication().matrix)
  })

  test('should return empty list if DbFindAllTodoItemsByUserIdRepository return empty list', async () => {
    const { sut, findAllTodoItemsByUserIdRepositorySpy } = makeSut()
    jest.spyOn(findAllTodoItemsByUserIdRepositorySpy, 'findAllByUserId')
      .mockResolvedValue([])
    const userIdParam = 1
    const todoItemsList = await sut.findAllByUserId(userIdParam)
    expect(todoItemsList).toEqual([])
  })
})
