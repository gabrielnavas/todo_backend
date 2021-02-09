import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('UPDATE /todo/:idTodoItem', () => {
  describe('Expected success 200', () => {
    beforeEach(async () => {
      await PGHelper.getPool().query('DELETE FROM public."user_temporary_password" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
    })

    afterEach(async () => {
      await PGHelper.getPool().query('DELETE FROM public."user_temporary_password" CASCADE')
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
          .post('/api/todo')
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
        .put(`/api/todo/${respTodoInserted.body.id}`)
        .set('x-access-token', token)
        .send({
          idNameTodoArea: 'any_id_todo_area',
          title: 'any_title',
          description: 'any_description'
        })
        .then(r => r)
      done()
      expect(respTodoUpdated.status).toEqual(200)
      expect(respTodoUpdated.body.id).toBeGreaterThanOrEqual(1)
      expect(respTodoUpdated.body.idNameTodoArea).toEqual('any_id_todo_area')
      expect(respTodoUpdated.body.title).toEqual('any_title')
      expect(respTodoUpdated.body.description).toEqual('any_description')
    })
  })

  describe('Expect 400 badRequest', () => {
    beforeEach(async () => {
      await PGHelper.getPool().query('DELETE FROM public."user_temporary_password" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
    })

    afterEach(async () => {
      await PGHelper.getPool().query('DELETE FROM public."user_temporary_password" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
    })

    test('should return 400 on /api/signup missing idNameTodoArea', async done => {
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
          .post('/api/todo')
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
        .put(`/api/todo/${respTodoInserted.body.id}`)
        .set('x-access-token', token)
        .send({
          title: 'any_title',
          description: 'any_description'
        })
        .then(r => {
          return r
        })
      done()
      expect(respTodoUpdated.status).toEqual(400)
    })

    test('should return 400 on /api/signup missing title', async done => {
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
          .post('/api/todo')
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
        .put(`/api/todo/${respTodoInserted.body.id}`)
        .set('x-access-token', token)
        .send({
          idNameTodoArea: 'any_id_todo_area',
          description: 'any_description'
        })
        .then(r => {
          return r
        })
      done()
      expect(respTodoUpdated.status).toEqual(400)
    })

    describe('Expect 404 not found', () => {
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

      test('should return 400 on /api/signup missing idTodoItem', async done => {
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
        const responseSignup = await createNewUserAccount()
        const token = responseSignup.body.token
        const respTodoUpdated = await request(app)
          .put('/todo/undefined')
          .set('x-access-token', token)
          .send({
            idNameTodoArea: 'any_id_todo_area',
            title: 'any_title',
            description: 'any_description'
          })
          .then(r => {
            return r
          })
        done()
        expect(respTodoUpdated.status).toEqual(404)
      })
    })

    test('should return 400 on /api/signup missing description', async done => {
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
          .post('/api/todo')
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
        .put(`/api/todo/${respTodoInserted.body.id}`)
        .set('x-access-token', token)
        .send({
          idNameTodoArea: 'any_id_todo_area',
          title: 'any_title'
        })
        .then(r => {
          return r
        })
      done()
      expect(respTodoUpdated.status).toEqual(400)
    })
  })

  describe('Expect 401 forbidden', () => {
    beforeEach(async () => {
      await PGHelper.getPool().query('DELETE FROM public."user_temporary_password" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
    })

    afterEach(async () => {
      await PGHelper.getPool().query('DELETE FROM public."user_temporary_password" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
      await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
    })
    test('should return 401 on UpdateOneTodoItem with correct params', async done => {
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
          .post('/api/todo')
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
        .put(`/api/todo/${respTodoInserted.body.id}`)
        .send({
          idNameTodoArea: 'any_id_todo_area',
          title: 'any_title',
          description: 'any_description'
        })
        .then(r => r)
      done()
      expect(respTodoUpdated.status).toEqual(401)
    })
  })
})
