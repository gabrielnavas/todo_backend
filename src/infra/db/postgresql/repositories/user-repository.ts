import { UserModelRepository } from '@/data/models/user-model-repository'
import { UserFindOneByEmailRepository } from '@/data/protocols/user-find-one-by-email-repository'
import { UserInsertOneRepository, UserInsertOneRepositoryParams } from '@/data/protocols/user-insert-one-repository'
import { db } from '@/infra/db/postgresql/helpers/connection-helper'

export class UserPostgreSQLRepository
implements UserInsertOneRepository, UserFindOneByEmailRepository {
  async insertOne (params: UserInsertOneRepositoryParams): Promise<UserModelRepository> {
    console.log([...Object.values(params)])
    const sql = `
      INSERT INTO public."user" (name, email, password)
      VALUES ($<name>, $<email>, $<password>)
      RETURNING id, name, email, password
    `
    const userMRepository = await db.oneOrNone<UserModelRepository>(sql, params)
    return userMRepository
  }

  async findByEmail (email: string): Promise<UserModelRepository> {
    const sql = `
      SELECT id, name, email, password
      FROM public."user" 
      WHERE email = $<email>
    `
    const userMRepository = await db.oneOrNone<UserModelRepository>(sql, { email })
    return userMRepository
  }
}
