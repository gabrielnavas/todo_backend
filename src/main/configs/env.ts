import dotenv from 'dotenv'

dotenv.config()

export default {
  // server configs
  server_port: process.env.SERVER_PORT || 3030,

  // database configs
  database_host: process.env.DATABASE_HOST || 'localhost',
  database_port: process.env.DATABASE_PORT || '5432',
  database_name: process.env.DATABASE_NAME || 'todo',
  database_user: process.env.DATABASE_USER || 'postgres',
  database_passsword: process.env.DATABASE_PASSWORD || 'postgres'
}
