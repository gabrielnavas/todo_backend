import { Hasher } from '../interfaces'

export const makeHasherSpy = (passwordHashed: string): Hasher => {
  class HasherSpy implements Hasher {
    async hash (plaintext: Hasher.Params): Promise<Hasher.Result> {
      return passwordHashed
    }
  }
  return new HasherSpy()
}
