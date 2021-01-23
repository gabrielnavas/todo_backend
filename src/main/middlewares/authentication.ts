import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { authenticationMiddlewareFactory } from '../factories/middlewares/authentication-middleware-factory'

export const authentication = adaptMiddleware(authenticationMiddlewareFactory())
