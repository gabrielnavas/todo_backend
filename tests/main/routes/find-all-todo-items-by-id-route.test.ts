import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('GET /find_all_todo_items_by_user_id', () => {
  describe('Expect success 200', () => {
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
    test('should return 200 and array list of the find_all_todo_items_by_user_id route', async done => {
      const token = await request(app)
        .post('/api/signup')
        .send({
          name: 'Gabriel Navas',
          email: 'gabrielnavas@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
        .then(res => res.body.token)
      await request(app)
        .post('/api/todo')
        .set('x-access-token', token)
        .send({
          idNameTodoArea: 'any_id_todo_area1',
          title: 'any_title',
          description: 'any_description__01'
        })
        .expect(200)
      await request(app)
        .post('/api/todo')
        .set('x-access-token', token)
        .send({
          idNameTodoArea: 'any_id_todo_area1',
          title: 'any_title',
          description: 'any_description__02'
        })
        .expect(200)
      await request(app)
        .post('/api/todo')
        .set('x-access-token', token)
        .send({
          idNameTodoArea: 'any_id_todo_area2',
          title: 'any_title',
          description: 'any_description__02'
        })
        .expect(200)
      const resp = await request(app)
        .get('/api/todo')
        .set('x-access-token', token)
        .send()
        .expect(200)
      done()
      expect(resp.body.length).toEqual(2)
      expect(resp.body[0][0].idNameTodoArea).toEqual('any_id_todo_area1')
      expect(resp.body[0][1].description).toEqual('any_description__02')
      expect(resp.body[1][0].idNameTodoArea).toEqual('any_id_todo_area2')
    })

    test('should return 200 and empty array of the find_all_todo_items_by_user_id route', async done => {
      const token = await request(app)
        .post('/api/signup')
        .send({
          name: 'Gabriel Navas',
          email: 'gabrielnavas@gmail.com',
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)
        .then(res => res.body.token)
      const resp = await request(app)
        .get('/api/todo')
        .set('x-access-token', token)
        .send()
        .expect(200)
      done()
      expect(resp.body).toEqual([])
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

    test('should return 401, with incorrect token', async done => {
      const token = 'any_token'
      await request(app)
        .get('/api/todo')
        .set('x-access-token', token)
        .send()
        .expect(401)
      done()
    })

    test('should return 401, without token', async done => {
      await request(app)
        .get('/api/todo')
        .send()
        .expect(401)
      done()
    })
  })
})
