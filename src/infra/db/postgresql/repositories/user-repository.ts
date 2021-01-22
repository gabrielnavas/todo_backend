import {
  FindOneUserByEmailRepository,
  FindOneUserByIdRepository,
  InsertOneUserRepository
} from '@/data/interfaces/'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

export class UserPostgreSQLRepository
implements InsertOneUserRepository, FindOneUserByEmailRepository, FindOneUserByIdRepository {
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

  async findOneByEmail (email: FindOneUserByEmailRepository.Params):
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

  async findOneById (id: FindOneUserByIdRepository.Params): Promise<FindOneUserByIdRepository.Result> {
    const sql = `
      SELECT id, name, email, password
      FROM public."user" 
      WHERE id = $1
    `
    const userMRepository = await PGHelper
      .getPool()
      .query(sql, [id])
    return userMRepository.rowCount > 0 ? userMRepository.rows[0] : null
  }
}
