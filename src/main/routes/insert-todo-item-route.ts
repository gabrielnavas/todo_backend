import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import {
  insertTodoItemControllerFactory
} from '../factories/controllers/insert-todo-item-controller-factory'
import { authentication } from '../middlewares/authentication'

export default (route: Router) => {
  route.post('/todo', authentication, adaptRoute(insertTodoItemControllerFactory()))
}
