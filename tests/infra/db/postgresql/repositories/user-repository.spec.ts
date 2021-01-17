import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'

describe('UserPostgreSQLRepository', () => {
  beforeEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  afterEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  test('should call insertOne() with correct InsertOneUserRepository.Params', async () => {
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

  test('should call findByEmail() with correct FindOneUserByEmailRepository.Params if not found', async () => {
    const sut = new UserPostgreSQLRepository()
    const resp = await sut.findByEmail('any_email')
    expect(resp).toBe(null)
  })

  test('should returns a user if findByEmail() returns correct user found', async () => {
    const sut = new UserPostgreSQLRepository()
    const params = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const userCreated = await sut.insertOne(params)
    const respFound = await sut.findByEmail(params.email)
    expect(respFound).toEqual(userCreated)
  })

  test('should throw if findByEmail() throws', async () => {
    const sut = new UserPostgreSQLRepository()
    jest.spyOn(sut, 'findByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.findByEmail('any_email')
    expect(promise).rejects.toThrowError(new Error())
  })
})
