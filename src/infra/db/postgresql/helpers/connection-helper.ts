import pgPromise from 'pg-promise'
import env from 'main/configs/env'

// Initializing the library:
const pgp = pgPromise()

// Creating the database instance with extensions:
const db = pgp({
  host: env.database_host,
  port: Number(env.database_port),
  database: env.database_name,
  user: env.database_user,
  password: env.database_passsword
})

export { db, pgp }
