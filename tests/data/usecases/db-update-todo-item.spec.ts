import { UpdateOneTodoItemRespository } from '@/data/interfaces/update-one-todo-item-respository'
import { DbUpdateTodoItem } from '@/data/usecases/db-update-todo-item'
import { UpdateTodoItem } from '@/domain/usecases/update-todo-item'

const makeUpdateOneTodoItemRespository = (): UpdateOneTodoItemRespository => {
  return new class UpdateOneTodoItemRespositorySpy implements UpdateOneTodoItemRespository {
    async updateOne (params: UpdateOneTodoItemRespository.Params): Promise<UpdateOneTodoItemRespository.Result> {
      return {
        id: 1,
        idNameTodoArea: 'any_name_todo_area_id',
        title: 'any_title',
        description: 'any_description'
      }
    }
  }()
}

type TypesSut = {
  sut: DbUpdateTodoItem
  updateOneTodoItemRespositorySpy: UpdateOneTodoItemRespository

}

const makeSut = (): TypesSut => {
  const updateOneTodoItemRespositorySpy = makeUpdateOneTodoItemRespository()
  const sut = new DbUpdateTodoItem(
    updateOneTodoItemRespositorySpy
  )
  return {
    sut,
    updateOneTodoItemRespositorySpy
  }
}

describe('DbInsertTodoItem', () => {
  test('should call InsertTodoItemRepository with correct params', async () => {
    const {
      sut,
      updateOneTodoItemRespositorySpy: insertOneTodoItemRepository
    } = makeSut()

    const insertOneTodoItemRespositorySpy =
      jest.spyOn(insertOneTodoItemRepository, 'updateOne')
    const sutParams = {
      todoItem: {
        id: 1,
        title: 'any_title',
        description: 'any_description',
        idNameTodoArea: 'any_id_todo_area_name'
      },
      user: {
        id: 1
      }
    } as UpdateTodoItem.Params
    await sut.updateOne(sutParams)
    expect(insertOneTodoItemRespositorySpy)
      .toHaveBeenCalledWith({
        todoItem: sutParams.todoItem,
        user: sutParams.user
      })
  })

  test('should return throw if InsertTodoItemRepository throws', () => {
    const { sut, updateOneTodoItemRespositorySpy } = makeSut()
    jest.spyOn(updateOneTodoItemRespositorySpy, 'updateOne')
      .mockRejectedValueOnce(new Error('any_error'))
    const sutParams = {
      todoItem: {
        id: 1,
        title: 'any_title',
        description: 'any_description',
        idNameTodoArea: 'any_id_todo_area_name'
      },
      user: {
        id: 1
      }
    } as UpdateTodoItem.Params
    const promise = sut.updateOne(sutParams)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return todoItemUpdated if InsertTodoItemRepository a todoItemUpdated', async () => {
    const { sut } = makeSut()
    const sutParams = {
      todoItem: {
        id: 1,
        title: 'any_title',
        description: 'any_description',
        idNameTodoArea: 'any_id_todo_area_name'
      },
      user: {
        id: 1
      }
    } as UpdateTodoItem.Params
    const todoItemUpdated = await sut.updateOne(sutParams)
    expect(todoItemUpdated).toEqual({
      id: 1,
      title: 'any_title',
      description: 'any_description',
      idNameTodoArea: 'any_name_todo_area_id'
    })
  })
})
