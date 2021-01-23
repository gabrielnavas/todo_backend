import { JwtAdapter } from '@/infra/cryptography'
import jwt from 'jsonwebtoken'

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('1')
      expect(signSpy).toHaveBeenCalledWith({ id: 1 }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('1')
      expect(accessToken).toBeTruthy()
    })

    test('Should throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => Promise.reject(new Error()))
      const promise = sut.encrypt('1')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('1')
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt(accessToken)
      expect(verifySpy).toHaveBeenCalledWith(accessToken, 'secret')
    })

    test('Should return a value on verify success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('1')
      const value = await sut.decrypt(accessToken)
      expect(value.issuedAt).toBeGreaterThanOrEqual(1)
      expect(value.payload).toEqual({ id: 1 })
    })

    test('Should throw if verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => Promise.reject(new Error()))
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
