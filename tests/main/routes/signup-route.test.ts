import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('POST /signup', () => {
  beforeEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  afterEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  test('should return 200 on signup with correct params', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gabriel Navas',
        email: 'gabrielnavas@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
  })

  test('should return 400 on signup if email exists', async () => {
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
      .post('/api/signup')
      .send({
        name: 'Gabriel Navas',
        email: 'gabrielnavas@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(400)
  })

  test('should return 400 on signup if no name is provided', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        email: 'gabrielnavas@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(400)
  })

  test('should return 400 on signup if no email is provided', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gabriel Navas',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(400)
  })

  test('should return 400 on signup if no password is provided', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gabriel Navas',
        email: 'gabrielnavas@gmail.com',
        passwordConfirmation: '123456'
      })
      .expect(400)
  })

  test('should return 400 on signup if no passwordConfirmation is provided', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gabriel Navas',
        email: 'gabrielnavas@gmail.com',
        password: '123456'
      })
      .expect(400)
  })

  test('should return 400 on signup if no password is different of the passwordConfirmation', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gabriel Navas',
        email: 'gabrielnavas@gmail.com',
        password: '1234567',
        passwordConfirmation: '123456'
      })
      .expect(400)
  })
})
