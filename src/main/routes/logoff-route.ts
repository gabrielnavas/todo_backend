import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import { logoffControllerFactory } from '../factories/controllers/logoff-controller-factory'
import { authentication } from '../middlewares/authentication'

export default (route: Router) => {
  route.post('/logoff', authentication, adaptRoute(logoffControllerFactory()))
}
