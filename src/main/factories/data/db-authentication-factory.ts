import { DbAuthentication } from '@/data/usecases/db-authentication'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter'
import { UserPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-repository'
import { UserTokenAccessPostgreSQLRepository } from '@/infra/db/postgresql/repositories/user-token-access-repository'
import env from '@/main/configs/env'

export const dbAuthenticationFactory = () => {
  const userTokenAccessRepository = new UserTokenAccessPostgreSQLRepository()
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtKeySecret)
  const userRepository = new UserPostgreSQLRepository()
  return new DbAuthentication(
    userRepository,
    bcryptAdapter,
    jwtAdapter,
    userTokenAccessRepository
  )
}
