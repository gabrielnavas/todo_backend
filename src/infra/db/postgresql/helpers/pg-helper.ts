import { Pool } from 'pg'
import env from '@/main/configs/env'

import dotenv from 'dotenv'

dotenv.config()

const makeCorrectAmbientPool = () => {
  if (['test', 'development'].includes(env.nodeEnv)) {
    return new Pool({
      host: env.databaseHost,
      port: Number(env.databasePort),
      database: env.databaseName,
      user: env.databaseUser,
      password: env.databasePasssword
    })
  }

  return new Pool({
    connectionString: env.databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
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
