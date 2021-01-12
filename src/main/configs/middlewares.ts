import {Express} from 'express'
import { json } from '../middlewares/json'

export default (app: Express) => {
  app.use(json())
}