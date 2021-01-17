import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'
import { UserTokenAccessPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-token-access-repository'

describe('UserTokenAccessPostgreSQLRepository', () => {
  beforeEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  afterEach(async () => {
    await PGHelper.getPool().query('DELETE FROM public."user_token_access" CASCADE')
    await PGHelper.getPool().query('DELETE FROM public."user" CASCADE')
  })

  test('should call insertOne() with correct params and returns the correct result', async () => {
    const sut = new UserTokenAccessPostgreSQLRepository()
    const userRepository = new UserPostgreSQLRepository()
    const user = await userRepository.insertOne({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    })
    const result = await sut.insertOne({
      idUser: user.id,
      token: 'any_token'
    })
    expect(result.id).toBeGreaterThanOrEqual(1)
    expect(result.createdAt).toBeTruthy()
    expect(result.token).toBe('any_token')
  })

  test('should throws if insertOne() throws', async () => {
    const sut = new UserTokenAccessPostgreSQLRepository()
    jest.spyOn(sut, 'insertOne').mockRejectedValueOnce(new Error())
    const userRepository = new UserPostgreSQLRepository()
    const user = await userRepository.insertOne({
      email: 'any_email',
      name: 'any_name',
      password: 'any_password'
    })
    const promise = sut.insertOne({
      idUser: user.id,
      token: 'any_token'
    })
    expect(promise).rejects.toThrow()
  })
})
