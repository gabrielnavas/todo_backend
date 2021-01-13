import { Router } from 'express'
import { signupControllerFactory } from '../../main/factories/presentation/controllers/signup-factory'

export default (route: Router) => {
  route.post('/signup', signupControllerFactory().handle)
}
