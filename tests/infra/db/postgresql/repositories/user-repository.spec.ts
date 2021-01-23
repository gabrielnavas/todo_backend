import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'
import { UserTokenAccessPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-token-access-repository'

describe('UserPostgreSQLRepository', () => {
  beforeEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  afterEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  describe('UserPostgreSQLRepository/InsertOneUserRepository', () => {
    test('should call insertOne() with correct InsertOneUserRepository.Params and returns InsertOneUserRepository.Result', async () => {
      const sut = new UserPostgreSQLRepository()
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      const { id, ...rest } = await sut.insertOne(params)
      expect(id).toBeGreaterThan(0)
      expect(rest).toEqual({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })
    })

    test('should throw if insertOne() throws', async () => {
      const sut = new UserPostgreSQLRepository()
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      jest.spyOn(sut, 'insertOne').mockRejectedValueOnce(new Error())
      const promise = sut.insertOne(params)
      expect(promise).rejects.toThrowError(new Error())
    })
  })

  describe('UserPostgreSQLRepository/findOneByEmail', () => {
    test('should call findOneByEmail() with correct FindOneUserByEmailRepository.Params if not found', async () => {
      const sut = new UserPostgreSQLRepository()
      const resp = await sut.findOneByEmail('any_email')
      expect(resp).toBe(null)
    })

    test('should returns a user if findOneByEmail() returns correct user found', async () => {
      const sut = new UserPostgreSQLRepository()
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      const userCreated = await sut.insertOne(params)
      const respFound = await sut.findOneByEmail(params.email)
      expect(respFound).toEqual({
        id: userCreated.id,
        name: params.name,
        email: params.email,
        password: params.password
      })
    })

    test('should returns null if findOneByEmail() not found user', async () => {
      const sut = new UserPostgreSQLRepository()
      const respFound = await sut.findOneByEmail('any_email_fake')
      expect(respFound).toEqual(null)
    })

    test('should throw if findOneByEmail() throws', async () => {
      const sut = new UserPostgreSQLRepository()
      jest.spyOn(sut, 'findOneByEmail')
        .mockRejectedValueOnce(new Error())
      const promise = sut.findOneByEmail('any_email')
      expect(promise).rejects.toThrowError(new Error())
    })
  })

  describe('UserPostgreSQLRepository/findOneById', () => {
    test('should call findOneById() with correct FindOneUserByEmailRepository.Params if not found', async () => {
      const sut = new UserPostgreSQLRepository()
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      const { id } = await sut.insertOne(params)
      const resp = await sut.findOneById(id)
      expect(resp).toEqual({
        id,
        name: params.name,
        email: params.email,
        password: params.password
      })
    })

    test('should returns a null if findOneById() user not found', async () => {
      const sut = new UserPostgreSQLRepository()
      const params = {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      }
      const { id: lastId } = await sut.insertOne(params)
      const idFake = lastId + 1
      const respFound = await sut.findOneById(idFake)
      expect(respFound).toEqual(null)
    })

    test('should throw if findOneById() throws', async () => {
      const sut = new UserPostgreSQLRepository()
      jest.spyOn(sut, 'findOneById')
        .mockRejectedValueOnce(new Error())
      const promise = sut.findOneById(1)
      expect(promise).rejects.toThrowError(new Error())
    })
  })

  describe('UserPostgreSQLRepository/FindOneByToken', () => {
    test('should call findOneByToken() with correct params', async () => {
      const userTokenAccessRepository = new UserTokenAccessPostgreSQLRepository()
      const userRepository = new UserPostgreSQLRepository()
      const sut = new UserPostgreSQLRepository()
      const user = await userRepository.insertOne({
        email: 'any_email',
        name: 'any_name',
        password: 'any_password'
      })
      const result = await userTokenAccessRepository.insertOne({
        idUser: user.id,
        token: 'any_token'
      })

      const userAccount = await sut.findOneByToken(result.token)
      expect(userAccount.id).toBeGreaterThanOrEqual(1)
      expect(userAccount.name).toEqual(user.name)
      expect(userAccount.email).toEqual(user.email)
      expect(userAccount.password).toEqual(user.password)
    })

    test('should return null if findOneByToken() return null', async () => {
      const sut = new UserPostgreSQLRepository()
      jest.spyOn(sut, 'findOneByToken').mockReturnValueOnce(null)
      const userAccount = await sut.findOneByToken('any_token')
      expect(userAccount).toEqual(null)
    })

    test('should return throw if findOneByToken() throws', () => {
      const sut = new UserPostgreSQLRepository()
      jest.spyOn(sut, 'findOneByToken').mockRejectedValueOnce(new Error('any_error'))
      const promise = sut.findOneByToken('any_token')
      expect(promise).rejects.toThrow(new Error('any_error'))
    })
  })
})
