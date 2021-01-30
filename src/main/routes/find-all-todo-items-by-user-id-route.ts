import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import { findAllTodoItemsByUserIdControllerFactory } from '../factories/controllers/find-all-todo-items-by-user-id-controller-factory'
import { authentication } from '../middlewares/authentication'

export default (route: Router) => {
  route.get(
    '/find_all_todo_items_by_user_id',
    authentication,
    adaptRoute(findAllTodoItemsByUserIdControllerFactory())
  )
}
