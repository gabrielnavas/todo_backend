import {
  UserPostgreSQLRepository
} from '@/infra/db/postgresql/repositories/user-repository'
import {
  UserTemporaryPasswordPostgreSQLRepository
} from '@/infra/db/postgresql/repositories/user-temporary-password'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

describe('UserTemporaryPassword', () => {
  describe('insertOne()', () => {
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

    test('should call with password and idUser and return a id', async () => {
      const userRepository = new UserPostgreSQLRepository()
      const respUserRepo = await userRepository.insertOne({
        name: 'any_name',
        email: 'any_email',
        password: 'any_password'
      })
      const sut = new UserTemporaryPasswordPostgreSQLRepository()
      const result = await sut.insertOne({
        idUser: respUserRepo.id,
        passwordTemporary: 'any_password'
      })
      expect(result.idTemporaryPassword).toBeTruthy()
      expect(result.idUser).toEqual(respUserRepo.id)
      expect(result.passwordTemporary).toEqual('any_password')
    })
  })
})
