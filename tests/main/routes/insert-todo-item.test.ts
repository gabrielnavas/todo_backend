import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('POST /insert_todo_item', () => {
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
    test('should return 200 on Insert One Todo Item with correct params', async done => {
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
            .post('/api/insert_todo_item')
            .set('x-access-token', token)
            .send({
              idNameTodoArea: 'any_id_todo_area',
              title: 'any_title',
              description: 'any_description'
            })
            .expect(200)
        })
      done()
    })
  })

  // describe('Expect 400 badRequest', () => {
  //   beforeEach(async () => {
  //     await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  //   })

  //   afterEach(async () => {
  //     await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  //   })

  //   test('should return 400 on /api/signup missing idNameTodoArea', async done => {
  //     await request(app)
  //       .post('/api/signup')
  //       .send({
  //         name: 'Gabriel Navas',
  //         email: 'gabrielnavas@gmail.com',
  //         password: '123456',
  //         passwordConfirmation: '123456'
  //       })
  //       .expect(200)
  //       .then(async res => {
  //         const token = res.body.token
  //         await request(app)
  //           .post('/api/insert_todo_item')
  //           .set('x-access-token', token)
  //           .send({
  //             title: 'any_title',
  //             description: 'any_descripasdasdsadasdtion'
  //           })
  //           .expect(400)
  //         done()
  //       })
  //   })

  //   test('should return 400 on /api/signup missing title', async done => {
  //     await request(app)
  //       .post('/api/signup')
  //       .send({
  //         name: 'Gabriel Navas',
  //         email: 'gabrielnavas@gmail.com',
  //         password: '123456',
  //         passwordConfirmation: '123456'
  //       })
  //       .expect(200)
  //       .then(async res => {
  //         const token = res.body.token
  //         await request(app)
  //           .post('/api/insert_todo_item')
  //           .set('x-access-token', token)
  //           .send({
  //             idNameTodoArea: 'any_todo_area_name',
  //             description: 'any_descripasdasdsadasdtion'
  //           })
  //           .expect(400)
  //         done()
  //       })
  //   })

  //   test('should return 400 on /api/signup missing description', async done => {
  //     await request(app)
  //       .post('/api/signup')
  //       .send({
  //         name: 'Gabriel Navas',
  //         email: 'gabrielnavas@gmail.com',
  //         password: '123456',
  //         passwordConfirmation: '123456'
  //       })
  //       .expect(200)
  //       .then(async res => {
  //         const token = res.body.token
  //         await request(app)
  //           .post('/api/insert_todo_item')
  //           .set('x-access-token', token)
  //           .send({
  //             idNameTodoArea: 'any_todo_area_name',
  //             title: 'any_title'
  //           })
  //           .expect(400)
  //         done()
  //       })
  //   })
  // })

  // describe('Expect 403 forbidden', () => {
  //   beforeEach(async () => {
  //     await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  //   })

  //   afterEach(async () => {
  //     await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  //   })

  //   test('should return 403 on /api/signup if token not found', async done => {
  //     const token = 'imATokenFake'
  //     await request(app)
  //       .post('/api/insert_todo_item')
  //       .set('x-access-token', token)
  //       .send({
  //         idNameTodoArea: 'any_todo_area_name',
  //         title: 'any_title'
  //       })
  //       .expect(403)
  //       .then(r => done())
  //   })

  //   test('should return 403 on /api/signup if missing token', async done => {
  //     await request(app)
  //       .post('/api/insert_todo_item')
  //       .send({
  //         idNameTodoArea: 'any_todo_area_name',
  //         title: 'any_title'
  //       })
  //       .expect(403)
  //       .then(r => done())
  //   })
  // })
})
