import express, { Express } from 'express'
import authentication from '../routes/authentication-route'

export default (app: Express) => {
  const router = express.Router()
  authentication(router)
  app.use('/api', router)
}
