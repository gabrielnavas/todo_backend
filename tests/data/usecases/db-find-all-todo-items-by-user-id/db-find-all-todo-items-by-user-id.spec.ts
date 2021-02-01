import { FindAllTodoItemsByUserIdRepository } from '../../interfaces/find-all-todo-items-by-user-id-repository'
import { makeMatrixClassication, makeTodoItemsListWithRandomTodoAreas } from '../../mocks/mock-db-find-all-todo-items-by-user-id'
import { DbFindAllTodoItemsByUserId } from '@/data/usecases/db-find-all-todo-items-by-user-id'
import { MatrixClassification } from '../../interfaces/matrix-classification'

const userId = 1
const todoItemsList = makeTodoItemsListWithRandomTodoAreas(userId)

const makeFindAllTodoItemsByUserIdRepository = (): FindAllTodoItemsByUserIdRepository => {
  class FindAllTodoItemsByUserIdRepositorySpy implements FindAllTodoItemsByUserIdRepository {
    async findAllByUserId (userId: FindAllTodoItemsByUserIdRepository.Params):
    Promise<FindAllTodoItemsByUserIdRepository.Result> {
      return todoItemsList.map(item => ({ ...item, userId }))
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
    expect(matrixClassicationSpy).toHaveBeenCalledWith(makeTodoItemsListWithRandomTodoAreas(userIdParam))
  })

  test('should return an matrix list if ok', async () => {
    const { sut } = makeSut()
    const userIdParam = 1
    const todoItemsList = await sut.findAllByUserId(userIdParam)
    expect(todoItemsList).toEqual(makeMatrixClassication().getMatrix())
  })

  test('should call clear of the matrix', async () => {
    const { sut, matrixClassicationSpy: matrixClassication } = makeSut()
    const matrixClassicationClearSpy = jest.spyOn(matrixClassication, 'clear')
    const userIdParam = 1
    await sut.findAllByUserId(userIdParam)
    expect(matrixClassicationClearSpy).toHaveBeenNthCalledWith(1)
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
