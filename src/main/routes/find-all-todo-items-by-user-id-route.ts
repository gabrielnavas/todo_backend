import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import { findAllTodoItemsByUserIdControllerFactory } from '../factories/controllers/find-all-todo-items-by-user-id-controller-factory'
import { authentication } from '../middlewares/authentication'

export default (route: Router) => {
  route.get(
    '/todo',
    authentication,
    adaptRoute(findAllTodoItemsByUserIdControllerFactory())
  )
}
