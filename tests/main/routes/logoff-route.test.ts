import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('POST /logoff', () => {
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
    test('should return 401 if logoff success', async done => {
      const makeUserAndReturnToken = () => {
        return request(app)
          .post('/api/signup')
          .send({
            name: 'Gabriel Navas',
            email: 'gabrielnavas@gmail.com',
            password: '123456',
            passwordConfirmation: '123456'
          })
          .expect(200)
          .then(res => res.body.token)
      }

      const makeLogoffWithToken = async (token: string) => {
        await request(app)
          .post('/api/logoff')
          .set('x-access-token', token)
          .send({
            name: 'Gabriel Navas',
            email: 'gabrielnavas@gmail.com',
            password: '123456',
            passwordConfirmation: '123456'
          })
          .expect(200)
          .then(res => res.body.token)
      }
      const checkIfCanInsertTodoItemWithInvalidToken = async (invalidToken: string) => {
        await request(app)
          .post('/api/todo')
          .set('x-access-token', invalidToken)
          .send({
            idNameTodoArea: 'any_id_todo_area',
            title: 'any_title',
            description: 'any_description'
          })
          .expect(401)
      }
      const token = await makeUserAndReturnToken()
      await makeLogoffWithToken(token)
      await checkIfCanInsertTodoItemWithInvalidToken(token)
      done()
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

    test('should return 400 on /api/signup missing idNameTodoArea', async done => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Gabriel Navas',
          email: 'gabrielnavas@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
        .then(async res => {
          const token = res.body.token
          await request(app)
            .post('/api/todo')
            .set('x-access-token', token)
            .send({
              title: 'any_title',
              description: 'any_descripasdasdsadasdtion'
            })
            .expect(400)
          done()
        })
    })

    test('should return 400 on /api/signup missing title', async done => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Gabriel Navas',
          email: 'gabrielnavas@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
        .then(async res => {
          const token = res.body.token
          await request(app)
            .post('/api/todo')
            .set('x-access-token', token)
            .send({
              idNameTodoArea: 'any_todo_area_name',
              description: 'any_descripasdasdsadasdtion'
            })
            .expect(400)
          done()
        })
    })

    test('should return 400 on /api/signup missing description', async done => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Gabriel Navas',
          email: 'gabrielnavas@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
        .then(async res => {
          const token = res.body.token
          await request(app)
            .post('/api/todo')
            .set('x-access-token', token)
            .send({
              idNameTodoArea: 'any_todo_area_name',
              title: 'any_title'
            })
            .expect(400)
          done()
        })
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
        .post('/api/todo')
        .set('x-access-token', token)
        .send({
          idNameTodoArea: 'any_todo_area_name',
          title: 'any_title'
        })
        .expect(401)
        .then(r => done())
    })

    test('should return 401 on /api/signup if missing token', async done => {
      await request(app)
        .post('/api/todo')
        .send({
          idNameTodoArea: 'any_todo_area_name',
          title: 'any_title'
        })
        .expect(401)
        .then(r => done())
    })
  })
})
