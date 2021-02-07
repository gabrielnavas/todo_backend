import faker from 'faker'

import { CreatePasswordRandom } from '@/data/interfaces/create-password-random'

export class FakerAdapter implements CreatePasswordRandom {
  createPasswordRandomWithLength (maxLength: number): string {
    const passwordRandom = faker.internet.password(maxLength)
    return passwordRandom
  }
}
