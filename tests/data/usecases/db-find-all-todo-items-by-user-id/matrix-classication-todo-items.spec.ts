import { makeMatrixClassication, makeTodoItemsListWithRandomTodoAreas } from '../../mocks/mock-db-find-all-todo-items-by-user-id'
import { MatrixClassicationTodoItems } from '@/data/usecases/db-find-all-todo-items-by-user-id/matrix-classification-todo-items'

describe('MatrixClassicationTodoItems', () => {
  test('should return a correct matrix classificated ', () => {
    const sut = new MatrixClassicationTodoItems()
    sut.addList(makeTodoItemsListWithRandomTodoAreas())
    expect(sut.matrix).toEqual(makeMatrixClassication().matrix)
  })
})
