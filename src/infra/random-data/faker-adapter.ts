import faker from 'faker'

import { CreatePasswordRandom } from '@/data/interfaces/create-password-random'

export class FakerAdapter implements CreatePasswordRandom {
  async createPasswordRandomWithLength (maxLength: number): Promise<string> {
    const passwordRandom = faker.internet.password(maxLength)
    return passwordRandom
  }
}
