import { InsertOnePasswordTemporaryByEmailRepository } from '@/data/interfaces/insert-one-password-temporary-by-email-repository'
import { PGHelper } from '../helpers/pg-helper'

export class UserTemporaryPasswordPostgreSQLRepository
implements InsertOnePasswordTemporaryByEmailRepository {
  async insertOne (params: InsertOnePasswordTemporaryByEmailRepository.Params):
    Promise<InsertOnePasswordTemporaryByEmailRepository.Result> {
    const { idUser, passwordTemporary } = params
    const sql = `
      INSERT INTO public."user_temporary_password" (
        id_user,
        password
      ) VALUES (
        $1, 
        $2
      ) RETURNING id; 
    `
    const result = await PGHelper
      .getPool()
      .query(sql, [idUser, passwordTemporary])
    const returning = result.rowCount > 0
      ? {
          idTemporaryPassword: result.rows[0].id,
          idUser,
          passwordTemporary
        }
      : null
    return returning
  }
}
