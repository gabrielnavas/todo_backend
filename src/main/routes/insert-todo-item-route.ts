import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import {
  insertTodoItemControllerFactory
} from '../factories/presentation/controllers/insert-todo-item-controller-factory'

export default (route: Router) => {
  route.post('/insert_todo_item', adaptRoute(insertTodoItemControllerFactory()))
}
