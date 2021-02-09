import dotenv from 'dotenv'

dotenv.config()

export default {
  // server configs
  serverPort: process.env.PORT || 3030,

  // database configs
  databaseHost: 'localhost',
  databasePort: '5432',
  databaseName: 'todo',
  databaseUser: 'postgres',
  databasePasssword: 'postgres',
  databaseUrl: process.env.DATABASE_URL,

  // encrypter key
  jwtKeySecret: process.env.JWT_KEY_SECRET || 'im a key secret',

  // send email
  sendEmailHost: process.env.SEND_EMAIL_HOST,
  sendEmailPassword: process.env.SEND_EMAIL_PASSWORD,
  sendEmailUser: process.env.SEND_EMAIL_USER,
  sendEmailPort: Number(process.env.SEND_EMAIL_PORT),
  sendEmailService: process.env.SEND_EMAIL_SERVICE,

  nodeEnv: process.env.NODE_ENV || 'development'
}
