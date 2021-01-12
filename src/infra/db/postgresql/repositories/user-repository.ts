import { UserModelRepository } from 'data/models/user-model-repository'
import { UserFindOneByEmailRepository } from 'data/protocols/user-find-one-by-email-repository'
import { UserInsertOneRepository, UserInsertOneRepositoryParams } from 'data/protocols/user-insert-one-repository'
import { db } from '../helpers/connection-helper'

export class UserPostgreSQLRepository
implements UserInsertOneRepository, UserFindOneByEmailRepository {
  async insertOne (params: UserInsertOneRepositoryParams): Promise<UserModelRepository> {
    const sql = `
        INSERT INTO public."user" (name, email, password)
        VALUES ($name, $email, $password) 
        RETURNING id, name, email, password
      `
    return await db.one<UserModelRepository>(sql, params)
  }

  async findByEmail (email: string): Promise<UserModelRepository> {
    const sql = `
      SELECT id, name, email, password
      FROM public."user" 
      WHERE email = $email
    `
    return await db.one<UserModelRepository>(sql, email)
  }
}
