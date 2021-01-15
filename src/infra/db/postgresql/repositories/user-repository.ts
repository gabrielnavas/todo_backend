import { UserModelRepository } from '@/data/models/user-model-repository'
import { UserFindOneByEmailRepository } from '@/data/interfaces/find-one-user-by-email-repository'
import { UserInsertOneRepository, UserInsertOneRepositoryParams } from '@/data/interfaces/insert-one-user-repository'
import { PGHelper } from '@/infra/db/postgresql/helpers/pg-helper'

export class UserPostgreSQLRepository
implements UserInsertOneRepository, UserFindOneByEmailRepository {
  async insertOne (params: UserInsertOneRepositoryParams): Promise<UserModelRepository> {
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

  async findByEmail (email: string): Promise<UserModelRepository> {
    const sql = `
      SELECT id, name, email, password
      FROM public."user" 
      WHERE email = $1
    `
    const userMRepository = await PGHelper
      .getPool()
      .query(sql, [email])
    return userMRepository.rows[0]
  }
}
