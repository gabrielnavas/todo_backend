import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('POST /update_todo_item', () => {
  describe('Expect success 200', () => {
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
    test('should return 200 on UpdateOneTodoItem with correct params', async done => {
      const createNewUserAccount = () => {
        return request(app)
          .post('/api/signup')
          .send({
            name: 'Gabriel Navas',
            email: 'gabrielnavas@gmail.com',
            password: '123456',
            passwordConfirmation: '123456'
          })
          .expect(200)
          .then(r => r)
      }
      const insertNewTodoItem = () => {
        return request(app)
          .post('/api/insert_todo_item')
          .set('x-access-token', token)
          .send({
            idNameTodoArea: 'any_id_todo_area',
            title: 'any_title',
            description: 'any_description'
          })
          .expect(200)
          .then(r => r)
      }
      const responseSignup = await createNewUserAccount()
      const token = responseSignup.body.token
      const respTodoInserted = await insertNewTodoItem()
      const respTodoUpdated = await request(app)
        .post('/api/update_todo_item')
        .set('x-access-token', token)
        .send({
          idTodoItem: respTodoInserted.body.id,
          idNameTodoArea: 'any_id_todo_area',
          title: 'any_title',
          description: 'any_description'
        })
        .then(r => {
          return r
        })
      done()
      expect(respTodoUpdated.status).toEqual(200)
      expect(respTodoUpdated.body.id).toBeGreaterThanOrEqual(1)
      expect(respTodoUpdated.body.idNameTodoArea).toEqual('any_id_todo_area')
      expect(respTodoUpdated.body.title).toEqual('any_title')
      expect(respTodoUpdated.body.description).toEqual('any_description')
    })
  })
})
