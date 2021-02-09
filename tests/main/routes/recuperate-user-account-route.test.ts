import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'
import env from '@/main/configs/env'

describe('POST /recuperate_user_account', () => {
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

    test('should send any_email and return 200', async done => {
      const createUserPromise = request(app)
        .post('/api/signup')
        .send({
          name: 'Gabriel Navas',
          email: env.sendEmailUser,
          password: '123456',
          passwordConfirmation: '123456'
        })
        .expect(200)

      const recupereteUserAccountPromise = request(app)
        .post('/api/recuperate_user_account')
        .send({
          email: env.sendEmailUser
        })
        .expect(200)
        .then(resp => {
          done()
          expect(resp.body).toEqual('')
        })
      await Promise.all([
        recupereteUserAccountPromise,
        createUserPromise
      ])
    })
  })

  // describe('Expect badRequest 400', () => {
  //   beforeEach(async () => {
  //     await PGHelper.getPool().query('DELETE FROM public."user_temporary_password" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  //   })

  //   afterEach(async () => {
  //     await PGHelper.getPool().query('DELETE FROM public."user_temporary_password" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
  //     await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  //   })

  //   test('should 400 if dont send missing email params', async done => {
  //     await request(app)
  //       .post('/api/signup')
  //       .send({
  //         name: 'Gabriel Navas',
  //         email: 'gabrielnavas@gmail.com',
  //         password: '123456',
  //         passwordConfirmation: '123456'
  //       })
  //       .expect(200)
  //       .then(res => res.body.token)

  //     await request(app)
  //       .post('/api/recuperate_user_account')
  //       .expect(400)
  //     done()
  //   })
  // })
})
