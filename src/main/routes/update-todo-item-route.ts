import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import {
  updateTodoItemControllerFactory
} from '../factories/controllers/update-todo-item-controller-factory'
import { authentication } from '../middlewares/authentication'

export default (route: Router) => {
  route.post('/update_todo_item', authentication, adaptRoute(updateTodoItemControllerFactory()))
}
