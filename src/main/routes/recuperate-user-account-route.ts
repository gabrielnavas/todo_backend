import { Router } from 'express'

import { adaptRoute } from '../adapters/express-route-adapter'
import { recuperateUserAccountControllerFactory } from '../factories/controllers/recuperate-user-account-controller-factory'

export default (route: Router) => {
  route.post(
    '/recuperate_user_account',
    adaptRoute(recuperateUserAccountControllerFactory())
  )
}
