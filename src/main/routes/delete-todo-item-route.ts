import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import {
  deleteTodoItemControllerFactory
} from '../factories/controllers/delete-todo-item-controller-factory'
import { authentication } from '../middlewares/authentication'

export default (route: Router) => {
  route.delete('/delete_todo_item/:idTodoItem', authentication, adaptRoute(deleteTodoItemControllerFactory()))
}
