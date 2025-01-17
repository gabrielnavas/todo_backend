import request from 'supertest'

import app from '@/main/configs/app'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('POST /signup', () => {
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

  test('should return 200 on signup with correct params', async done => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Gabriel Navas',
        email: 'gabrielnavas@gmail.com',
        password: '123456',
        passwordConfirmation: '123456'
      })
      .expect(200)
      .then(res => {
        expect(res.body).toBeTruthy()
        expect(res.body.token).toBeTruthy()
        expect(typeof res.body.token).toBe('string')
        expect(res.body.token.length).toBeGreaterThan(100)
        expect(res.body.userName).toBe('Gabriel Navas')
        expect(res.body.email).toBe('gabrielnavas@gmail.com')
        done()
      })
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
