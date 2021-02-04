import { Pool } from 'pg'
import env from '@/main/configs/env'

const makeCorrectAmbientPool = () => {
  if (env.nodeEnv === 'test') {
    return new Pool({
      host: env.database_host,
      port: Number(env.database_port),
      database: env.database_name,
      user: env.database_user,
      password: env.database_passsword
    })
  }
  console.log(env.nodeEnv)

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  })
}

export class PGHelper {
  private static readonly pool = makeCorrectAmbientPool()

  static getPool = () => {
    return PGHelper.pool
  }

  static getNewConnection = () => {
    return PGHelper.pool.connect()
  }
}
