import { FakerAdapter } from '@/infra/random-data'

describe('FakerAdapter', () => {
  describe('createPasswordRandomWithLength', () => {
    test('should call  and return a password random with length', async () => {
      const sut = new FakerAdapter()
      const maxLengthPassword = 10
      const passwordGenereted = await sut.createPasswordRandomWithLength(maxLengthPassword)
      expect(passwordGenereted.length).toEqual(10)
    })
  })
})
