import { InsertOneTodoItemRepository } from '@/data/interfaces/insert-one-todo-item-repository'
import { DbInsertTodoItem } from '@/data/usecases/db-insert-todo-item'

const makeInsertOneTodoItemRespository = (): InsertOneTodoItemRepository => {
  return new class InsertOneTodoItemRepositorySpy implements InsertOneTodoItemRepository {
    async insertOne (params: InsertOneTodoItemRepository.Params): Promise<InsertOneTodoItemRepository.Result> {
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
  insertOneTodoItemRespositorySpy: InsertOneTodoItemRepository

}

const makeSut = (): TypesSut => {
  const insertOneTodoItemRespositorySpy = makeInsertOneTodoItemRespository()
  const sut = new DbInsertTodoItem(
    insertOneTodoItemRespositorySpy
  )
  return {
    sut,
    insertOneTodoItemRespositorySpy
  }
}

describe('DbInsertTodoItem', () => {
  test('should call InsertTodoItemRepository with correct params', async () => {
    const {
      sut, insertOneTodoItemRespositorySpy: insertOneTodoItemRepository
    } = makeSut()

    const insertOneTodoItemRespositorySpy =
      jest.spyOn(insertOneTodoItemRepository, 'insertOne')
    const sutParams = {
      todoItem: {
        idNameTodoArea: 'any_todo_area_id',
        description: 'any_description',
        title: 'any_title'
      },
      user: { id: 1 }
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
    const { sut, insertOneTodoItemRespositorySpy } = makeSut()
    jest.spyOn(insertOneTodoItemRespositorySpy, 'insertOne')
      .mockRejectedValueOnce(new Error('any_error'))
    const sutParams = {
      todoItem: {
        idNameTodoArea: 'any_todo_area_id',
        description: 'any_description',
        title: 'any_title'
      },
      user: {
        id: 1
      }
    }
    const promise = sut.insertOne(sutParams)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should return true if InsertTodoItemRepository a todo item', async () => {
    const { sut } = makeSut()
    const sutParams = {
      todoItem: {
        idNameTodoArea: 'any_todo_area_id',
        description: 'any_description',
        title: 'any_title'
      },
      user: {
        id: 1
      }
    }
    const insertOk = await sut.insertOne(sutParams)
    expect(insertOk).toEqual(true)
  })
})
