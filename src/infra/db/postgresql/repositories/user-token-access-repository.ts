import { InsertOneUserTokenAccessRepository } from '@/data/interfaces/insert-one-user-token-access-repository'
import { InvalidateOneUserTokenAccessByIdRepository } from '@/data/interfaces/invalidate-one-user-token-access-repository'
import { PGHelper } from '../helpers/pg-helper'

export class UserTokenAccessPostgreSQLRepository
implements InsertOneUserTokenAccessRepository,
    InvalidateOneUserTokenAccessByIdRepository {
  insertOne = async (params: InsertOneUserTokenAccessRepository.Params):
    Promise<InsertOneUserTokenAccessRepository.Result> => {
    const sql = `
        INSERT INTO PUBLIC."user_token_access"
        (id_user, token, created_at)
        VALUES ($1, $2, $3)
        RETURNING id, token, created_at
      `
    const dateUTCNow = new Date(new Date().toUTCString())
    const resp = await PGHelper
      .getPool()
      .query(sql, [params.idUser, params.token, dateUTCNow])

    return {
      id: resp.rows[0].id,
      token: resp.rows[0].token,
      createdAt: resp.rows[0].created_at
    }
  }

  invalidateDateById = async (id: InvalidateOneUserTokenAccessByIdRepository.Params):
      Promise<InvalidateOneUserTokenAccessByIdRepository.Result> => {
    const sql = `
        UPDATE 
          PUBLIC."user_token_access"
        SET
          invalid_at = $2
        WHERE 
          id = $1
        RETURNING 
          PUBLIC."user_token_access".id as id_user_token, 
          token, 
          created_at,
          invalid_at
      `
    const dateUTCNow = new Date(new Date().toUTCString())
    const resp = await PGHelper
      .getPool()
      .query(sql, [id, dateUTCNow])
    return {
      id: resp.rows[0].id_user_token,
      token: resp.rows[0].token,
      createdAt: resp.rows[0].created_at,
      invalidAt: resp.rows[0].invalid_at
    }
  }
}
