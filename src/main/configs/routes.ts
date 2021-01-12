import express, {Express} from 'express'
import auth from '../routes/auth'

export default (app: Express) => {
  const router = express.Router()
  auth(router)
  app.use('/api', router)
}