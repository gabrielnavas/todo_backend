import { FindOneUserByEmailRepository, InsertOneUserRepository } from '@/data/interfaces/'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

export class UserPostgreSQLRepository
implements InsertOneUserRepository, FindOneUserByEmailRepository {
  async insertOne (params: InsertOneUserRepository.Params):
    Promise<InsertOneUserRepository.Result> {
    const sql = `
      INSERT INTO public."user" (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, password
    `
    const userMRepository = await PGHelper
      .getPool()
      .query(sql, [params.name, params.email, params.password])
    return userMRepository.rows[0]
  }

  async findByEmail (email: FindOneUserByEmailRepository.Params):
    Promise<FindOneUserByEmailRepository.Result> {
    const sql = `
      SELECT id, name, email, password
      FROM public."user" 
      WHERE email = $1
    `
    const userMRepository = await PGHelper
      .getPool()
      .query(sql, [email])
    return userMRepository.rowCount > 0 ? userMRepository.rows[0] : null
  }
}
