import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import { loginControllerFactory } from '../factories/presentation/controllers/'

export default (route: Router) => {
  route.post('/login', adaptRoute(loginControllerFactory()))
}
