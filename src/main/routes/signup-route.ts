import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import { signupControllerFactory } from '../factories/presentation/controllers/'

export default (route: Router) => {
  route.post('/signup', adaptRoute(signupControllerFactory()))
}
