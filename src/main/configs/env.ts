import dotenv from 'dotenv'

dotenv.config()

const makeDataBaseConfig = () =>
  process.env.NODE_ENV === 'test'
    ? {
        database_host: 'localhost',
        database_port: '5432',
        database_name: 'todo',
        database_user: 'postgres',
        database_passsword: 'postgres'
      }
    : {
        database_host: process.env.DATABASE_HOST || 'localhost',
        database_port: process.env.DATABASE_PORT || '5432',
        database_name: process.env.DATABASE_NAME || 'todo',
        database_user: process.env.DATABASE_USER || 'postgres',
        database_passsword: process.env.DATABASE_PASSWORD || 'postgres'
      }

export default {
  // server configs
  server_port: process.env.SERVER_PORT || 3000,

  // database configs
  ...makeDataBaseConfig(),

  // encrypter key
  jwtKeySecret: process.env.JWT_KEY_SECRET || 'im a key secret'
}
