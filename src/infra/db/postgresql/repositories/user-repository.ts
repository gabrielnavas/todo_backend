import {
  FindOneUserByEmailRepository,
  FindOneUserByIdAndTokenRepository,
  InsertOneUserRepository
} from '@/data/interfaces/'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

export class UserPostgreSQLRepository
implements
InsertOneUserRepository,
FindOneUserByEmailRepository,
FindOneUserByIdAndTokenRepository {
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

  async findOneByIdAndToken (params: FindOneUserByIdAndTokenRepository.Params):
    Promise<FindOneUserByIdAndTokenRepository.Result> {
    const { idUser, token } = params
    const sql = `
      SELECT 
        public."user".id as id, name, email, password
      FROM 
        public."user",
        public."user_token_access"  
      WHERE 
        public."user".id = public."user_token_access".id_user and
        public."user".id = $1 and
        public."user_token_access".token = $2
    `
    const userMRepository = await PGHelper
      .getPool()
      .query(sql, [idUser, token])
    if (userMRepository.rowCount === 0) return
    return {
      id: userMRepository.rows[0].id,
      name: userMRepository.rows[0].name,
      email: userMRepository.rows[0].email,
      password: userMRepository.rows[0].password
    }
  }
}
