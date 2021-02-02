import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('DELETE /todo', () => {
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
    test('should return 200 on DeleteOneTodo Item with correct params', async done => {
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
      const respTodoItemInserted = await insertNewTodoItem()
      const respTodoUpdated = await request(app)
        .delete(`/api/todo/${respTodoItemInserted.body.id}`)
        .set('x-access-token', token)
        .then(r => r)
      done()
      expect(respTodoUpdated.status).toEqual(200)
    })
  })

  describe('Expect 400 badRequest', () => {
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

    test('should return 400 on /api/signup if id todo item is 0', async done => {
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
        .delete('/api/todo/0')
        .set('x-access-token', token)
        .then(r => r)
      done()
      expect(respTodoUpdated.status).toEqual(400)
    })

    test('should return 400 on /api/signup if id todo item is negative', async done => {
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
        .delete('/api/todo/-1')
        .set('x-access-token', token)
        .then(r => r)
      done()
      expect(respTodoUpdated.status).toEqual(400)
    })
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

    test('should return 404 on /api/signup missing idTodoItem', async done => {
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
        .delete('/api/todo')
        .set('x-access-token', token)
        .then(r => r)
      done()
      expect(respTodoUpdated.status).toEqual(404)
    })
  })

  describe('Expect 401 forbidden', () => {
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

    test('should return 401 on /api/signup if token not found', async done => {
      const token = 'imATokenFake'
      await request(app)
        .delete('/api/todo/1')
        .set('x-access-token', token)
        .expect(401)
        .then(r => done())
    })

    test('should return 401 on /api/signup if missing token', async done => {
      await request(app)
        .delete('/api/todo/1')
        .expect(401)
        .then(r => done())
    })
  })
})
