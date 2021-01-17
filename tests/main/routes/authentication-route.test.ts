import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('POST /login', () => {
  beforeAll(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  afterAll(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  test('should return 200 on login with correct params', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gabriel Navas',
        email: 'gabrielnavas@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
    await request(app)
      .post('/api/login')
      .send({
        email: 'gabrielnavas@gmail.com',
        password: '123456'
      })
      .expect(200)
  })

  test('should return 400 on login is incorrect', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'navas@gmail.com',
        password: '123456'
      })
      .expect(400)
  })

  test('should return 400 on password is incorrect', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'gabrielnavas@gmail.com',
        password: '654321'
      })
      .expect(400)
  })

  test('should return 400 on login if no email is provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        password: '123456'
      })
      .expect(400)
  })

  test('should return 400 on login if no password is provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'gabrielnavas@email.com'
      })
      .expect(400)
  })
})
