import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import { signupControllerFactory } from '../factories/controllers/signup-controller-factory'

export default (route: Router) => {
  route.post('/signup', adaptRoute(signupControllerFactory()))
}
