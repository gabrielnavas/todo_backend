import { Decrypter, Encrypter } from '@/data/interfaces'

import jwt from 'jsonwebtoken'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (plaintext: string): Promise<string> {
    return jwt.sign({ id: Number(plaintext) }, this.secret)
  }

  async decrypt (ciphertext: string): Promise<Decrypter.ReturnType> {
    const { iat, ...rest } = await jwt.verify(ciphertext, this.secret) as any

    return {
      issuedAt: iat ? Number(iat) : 0,
      payload: rest
    }
  }
}
