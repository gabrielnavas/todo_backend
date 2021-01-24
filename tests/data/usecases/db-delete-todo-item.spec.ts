import { DeleteOneTodoItemRepository } from '@/data/interfaces/delete-one-todo-item-repository'
import { DbDeleteTodoItem } from '@/data/usecases/db-delete.todo-item'

const makeDeleteOneTodoItemRespository = (): DeleteOneTodoItemRepository => {
  return new class DeleteOneTodoItemRepositorySpy implements DeleteOneTodoItemRepository {
    async deleteOne (params: DeleteOneTodoItemRepository.Params): Promise<DeleteOneTodoItemRepository.Result> {
      return {
        id: 1,
        idNameTodoArea: 'any_todo_area_id',
        title: 'any_title',
        description: 'any_description'
      }
    }
  }()
}

type TypesSut = {
  sut: DbDeleteTodoItem
  deleteOneTodoItemRespositorySpy: DeleteOneTodoItemRepository

}

const makeSut = (): TypesSut => {
  const deleteOneTodoItemRespositorySpy = makeDeleteOneTodoItemRespository()
  const sut = new DbDeleteTodoItem(
    deleteOneTodoItemRespositorySpy
  )
  return {
    sut,
    deleteOneTodoItemRespositorySpy
  }
}

describe('DbDeleteTodoItem', () => {
  test('should call DeleteOneTodoItemRepository with correct params', async () => {
    const {
      sut, deleteOneTodoItemRespositorySpy: deleteOneTodoItemRespository
    } = makeSut()

    const deleteOneTodoItemRespositorySpy =
      jest.spyOn(deleteOneTodoItemRespository, 'deleteOne')
    const id = 1
    await sut.deleteOne(id)
    expect(deleteOneTodoItemRespositorySpy)
      .toHaveBeenCalledWith(id)
  })

  test('should return throw if DeleteOneTodoItemRepository throws', () => {
    const { sut, deleteOneTodoItemRespositorySpy } = makeSut()
    jest.spyOn(deleteOneTodoItemRespositorySpy, 'deleteOne')
      .mockRejectedValueOnce(new Error('any_error'))
    const id = 1
    const promise = sut.deleteOne(id)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return false if InsertTodoItemRepository return null', async () => {
    const { sut, deleteOneTodoItemRespositorySpy } = makeSut()
    jest.spyOn(deleteOneTodoItemRespositorySpy, 'deleteOne')
      .mockReturnValueOnce(null)
    const id = 1
    const todoItem = await sut.deleteOne(id)
    expect(todoItem).toEqual(false)
  })

  test('should return true if InsertTodoItemRepository return todoItemModel', async () => {
    const { sut } = makeSut()
    const id = 1
    const todoItemModel = await sut.deleteOne(id)
    expect(todoItemModel).toEqual(true)
  })
})
