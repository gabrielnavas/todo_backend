import { InsertOneUserTokenAccessRepository } from '@/data/interfaces/insert-one-user-token-access-repository'
import { PGHelper } from '../helpers/pg-helper'

export class UserTokenAccessPostgreSQLRepository implements InsertOneUserTokenAccessRepository {
  insertOne = async (params: InsertOneUserTokenAccessRepository.Params):
    Promise<InsertOneUserTokenAccessRepository.Result> => {
    const sql = `
        INSERT INTO PUBLIC."user_token_access"
        (id_user, token, created_at)
        VALUES ($1, $2, $3)
        RETURNING id, token, created_at
      `
    const resp = await PGHelper
      .getPool()
      .query(sql, [params.idUser, params.token, new Date().toISOString()])

    return {
      id: resp.rows[0].id,
      token: resp.rows[0].token,
      createdAt: resp.rows[0].created_at
    }
  }
}
