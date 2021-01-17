import { Hasher } from '@/data/interfaces/hasher'
import { HashComparer } from '@/data/interfaces/hasher-comparer'

import bcrypt from 'bcrypt'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}

  async hash (plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, this.salt)
  }

  async compare (plaitext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaitext, digest)
  }
}
