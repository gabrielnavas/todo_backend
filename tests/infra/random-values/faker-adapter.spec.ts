import { FakerAdapter } from '@/infra/random-values/faker-adapter'

describe('FakerAdapter', () => {
  describe('createPasswordRandomWithLength', () => {
    test('should call  and return a password random with length', () => {
      const sut = new FakerAdapter()
      const maxLengthPassword = 10
      const passwordGenereted = sut.createPasswordRandomWithLength(maxLengthPassword)
      expect(passwordGenereted.length).toEqual(10)
    })
  })
})
