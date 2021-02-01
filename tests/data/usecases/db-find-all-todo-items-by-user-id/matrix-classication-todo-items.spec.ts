import { makeMatrixClassication, makeTodoItemsListWithRandomTodoAreas } from '../../mocks/mock-db-find-all-todo-items-by-user-id'
import { MatrixClassicationTodoItems } from '@/data/usecases/db-find-all-todo-items-by-user-id/matrix-classification-todo-items'

describe('MatrixClassicationTodoItems', () => {
  test('should return a correct matrix classificated ', () => {
    const sut = new MatrixClassicationTodoItems()
    const bruteList = makeTodoItemsListWithRandomTodoAreas()
    const mockCorrectMatrix = makeMatrixClassication()
    sut.addList(bruteList)
    expect(sut.getMatrix()).toEqual(mockCorrectMatrix.getMatrix())
  })

  test('should clear the matrix if clear is called', () => {
    const sut = new MatrixClassicationTodoItems()
    const bruteList = makeTodoItemsListWithRandomTodoAreas()
    const mockCorrectMatrix = makeMatrixClassication()
    sut.addList(bruteList)
    expect(sut.getMatrix()).toEqual(mockCorrectMatrix.getMatrix())
    sut.clear()
    expect(sut.getMatrix()).toEqual([])
  })
})
