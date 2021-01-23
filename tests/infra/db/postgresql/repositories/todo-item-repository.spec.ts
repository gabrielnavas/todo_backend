import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'
import { TodoItemPostgreSQLRepository } from '@/infra/db/postgresql/repositories/todo-item-repository'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'

describe('TodoItemPostgreSQLRepository', () => {
  beforeEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  afterEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  describe('TodoItemPostgreSQLRepository/insertOne', () => {
    test('should call insertOne() wich correct params', async () => {
      const sut = new TodoItemPostgreSQLRepository()
      const userRepository = new UserPostgreSQLRepository()
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      const user = await userRepository.insertOne(params)
      const resultInsert = await sut.insertOne({
        user: {
          id: user.id
        },
        todoItem: {
          title: 'any_title',
          description: 'any_description',
          idNameTodoArea: 'any_todo_name_area'
        }
      })
      expect(resultInsert.user).toEqual({
        id: user.id
      })
      expect(resultInsert.todoItem.id).toBeGreaterThan(0)
      expect(resultInsert.todoItem.title).toEqual('any_title')
      expect(resultInsert.todoItem.description).toEqual('any_description')
      expect(resultInsert.todoItem.idNameTodoArea).toEqual('any_todo_name_area')
    })

    test('should return throws if insertOne() throws', async () => {
      const sut = new TodoItemPostgreSQLRepository()
      const userRepository = new UserPostgreSQLRepository()
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      const user = await userRepository.insertOne(params)
      jest.spyOn(sut, 'insertOne').mockRejectedValueOnce(new Error('any_error'))
      const promise = sut.insertOne({
        user: {
          id: user.id
        },
        todoItem: {
          title: 'any_title',
          description: 'any_description',
          idNameTodoArea: 'any_todo_name_area'
        }
      })
      expect(promise).rejects.toThrow(new Error('any_error'))
    })
  })
})
