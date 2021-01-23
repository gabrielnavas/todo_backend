import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('POST /insert_todo_item', () => {
  beforeAll(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  afterAll(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."todo_item" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  /**
 *
 * {
        userAccess: {
          token: 'any_token'
        },
        todoItem: {
          idNameTodoArea: 'any_id_todo_area',
          title: 'any_title',
          description: 'any_description'
        }
      }
 */

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
          .send({
            userAccess: {
              token
            },
            todoItem: {
              idNameTodoArea: 'any_id_todo_area',
              title: 'any_title',
              description: 'any_descripasdasdsadasdtion'
            }
          })
          .expect(200)
        done()
      })
  })

  // test('should return 400 on Insert One Todo Item is incorrect', async done => {
  //   await request(app)
  //     .post('/api/insert_todo_item')
  //     .send({
  //       userAccess: {
  //         token: 'any_fake_token'
  //       },
  //       todoItem: {
  //         idNameTodoArea: 'any_id_todo_area',
  //         title: 'any_title',
  //         description: 'any_descripasdasdsadasdtion'
  //       }
  //     })
  //     .expect(200)
  //   done()
  // })

  // test('should return 400 on password is incorrect', async () => {
  //   await request(app)
  //     .post('/api/login')
  //     .send({
  //       email: 'gabrielnavas@gmail.com',
  //       password: '654321'
  //     })
  //     .expect(400)
  // })

  // test('should return 400 on login if no email is provided', async () => {
  //   await request(app)
  //     .post('/api/login')
  //     .send({
  //       password: '123456'
  //     })
  //     .expect(400)
  // })

  // test('should return 400 on login if no password is provided', async () => {
  //   await request(app)
  //     .post('/api/login')
  //     .send({
  //       email: 'gabrielnavas@email.com'
  //     })
  //     .expect(400)
  // })
})
