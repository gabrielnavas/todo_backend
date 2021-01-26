import { InsertOneUserTokenAccessRepository } from '@/data/interfaces/insert-one-user-token-access-repository'
import { InvalidateOneUserTokenAccessByUserIdRepository } from '@/data/interfaces/invalidate-one-user-token-access-repository'
import { PGHelper } from '../helpers/pg-helper'

export class UserTokenAccessPostgreSQLRepository
implements InsertOneUserTokenAccessRepository,
InvalidateOneUserTokenAccessByUserIdRepository {
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

  invalidateDateByUserId = async (idUser: InvalidateOneUserTokenAccessByUserIdRepository.Params):
      Promise<InvalidateOneUserTokenAccessByUserIdRepository.Result> => {
    const sqlInvalidtedUserTokenForUpdated = `
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
    const sqlFindUserTokenById = `
        SELECT id
        FROM public."user_token_access"
        WHERE id_user = $1
    `
    let respUpdated = undefined as any
    const dateUTCNow = new Date(new Date().toUTCString())
    const clientDB = await PGHelper.getNewConnection()
    try {
      await clientDB.query('BEGIN')
      const userTokenAccessResp = await clientDB.query(sqlFindUserTokenById, [idUser])
      if (userTokenAccessResp.rowCount === 0) return null
      const { id: idUserToken } = userTokenAccessResp.rows[0]
      respUpdated = await clientDB.query(sqlInvalidtedUserTokenForUpdated, [idUserToken, dateUTCNow])
      await clientDB.query('COMMIT')
    } catch (error) {
      await clientDB.query('ROLLBACK')
      throw error
    } finally {
      await clientDB.release()
    }

    return {
      id: respUpdated.rows[0].id_user_token,
      token: respUpdated.rows[0].token,
      createdAt: respUpdated.rows[0].created_at,
      invalidAt: respUpdated.rows[0].invalid_at
    }
  }
}
