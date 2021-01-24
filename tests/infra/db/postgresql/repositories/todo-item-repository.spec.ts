import { UpdateOneTodoItemRespository } from '@/data/interfaces'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'
import { TodoItemPostgreSQLRepository } from '@/infra/db/postgresql/repositories/todo-item-repository'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'

describe('TodoItemPostgreSQLRepository', () => {
  describe('TodoItemPostgreSQLRepository/insertOne', () => {
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
      expect(resultInsert.id).toBeGreaterThan(0)
      expect(resultInsert.title).toEqual('any_title')
      expect(resultInsert.description).toEqual('any_description')
      expect(resultInsert.idNameTodoArea).toEqual('any_todo_name_area')
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

  describe('TodoItemPostgreSQLRepository/updateOne', () => {
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
    test('should call updateOne() wich correct params', async () => {
      const insertOneTodoRepository = new TodoItemPostgreSQLRepository()
      const userRepository = new UserPostgreSQLRepository()
      const paramsInsertOneUser = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      const user = await userRepository.insertOne(paramsInsertOneUser)
      const paramsInsertTodo = {
        user: {
          id: user.id
        },
        todoItem: {
          title: 'any_title',
          description: 'any_description',
          idNameTodoArea: 'any_todo_name_area'
        }
      }
      const resultInsert = await insertOneTodoRepository.insertOne(paramsInsertTodo)
      const updateTodoParams = {
        user: {
          id: user.id
        },
        todoItem: {
          id: resultInsert.id,
          title: 'any_title_modified',
          description: 'any_description_modified',
          idNameTodoArea: 'any_todo_name_area_modified'
        }
      } as UpdateOneTodoItemRespository.Params
      const sut = new TodoItemPostgreSQLRepository()
      const resultUpdate = await sut.updateOne(updateTodoParams)
      expect(resultUpdate.id).toBeGreaterThan(0)
      expect(resultUpdate.title).toEqual('any_title_modified')
      expect(resultUpdate.description).toEqual('any_description_modified')
      expect(resultUpdate.idNameTodoArea).toEqual('any_todo_name_area_modified')
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
