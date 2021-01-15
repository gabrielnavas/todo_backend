import { Pool } from 'pg'
import env from '@/main/configs/env'

export class PGHelper {
  private static readonly pool = new Pool({
    host: env.database_host,
    port: Number(env.database_port),
    database: env.database_name,
    user: env.database_user,
    password: env.database_passsword
  })

  static getPool = () => {
    return PGHelper.pool
  }

  static getNewConnection = () => {
    return PGHelper.pool.connect()
  }
}
