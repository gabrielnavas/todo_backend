import { AuthenticationMiddleware } from '@/presentation/middlewares'
import { Middleware } from '@/presentation/interfaces'
import { dbLoadUserAccountByTokenFactory } from '../data/db-load-user-account-by-token-factory'
import { JwtAdapter } from '@/infra/cryptography'
import env from '@/main/configs/env'

export const authenticationMiddlewareFactory = (): Middleware => {
  const jwtAdapter = new JwtAdapter(env.jwtKeySecret)
  const dbLoadUserAccountByToken = dbLoadUserAccountByTokenFactory()
  return new AuthenticationMiddleware(dbLoadUserAccountByToken, jwtAdapter)
}
