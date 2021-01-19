import { makeAuthenticationMock } from '../mocks/mock-db-authentication'

describe('DbAuthentication', () => {
  test('should call checkEmail with correct email', async () => {
    const { sut, checkExistsUserByEmailSpy: checkExistsUserByEmail } = makeAuthenticationMock()
    const checkExistsUserByEmailSpySpy = jest.spyOn(checkExistsUserByEmail, 'findByEmail')
    const authParams = {
      email: 'any_email',
      password: 'any_password'
    }
    await sut.authenticate(authParams)
    expect(checkExistsUserByEmailSpySpy).toHaveBeenCalledWith(authParams.email)
  })

  test('should reject if checkEmail throws', () => {
    const { sut, checkExistsUserByEmailSpy } = makeAuthenticationMock()
    jest.spyOn(checkExistsUserByEmailSpy, 'findByEmail').mockImplementationOnce(() => {
      throw new Error()
    })
    const authParams = {
      email: 'any_email',
      password: 'any_password'
    }
    const promise = sut.authenticate(authParams)
    expect(promise).rejects.toThrow()
  })

  test('should return null if checkEmail return null', async () => {
    const { sut, checkExistsUserByEmailSpy } = makeAuthenticationMock()
    jest.spyOn(checkExistsUserByEmailSpy, 'findByEmail').mockReturnValueOnce(null)
    const authParams = {
      email: 'any_email',
      password: 'any_password'
    }
    const respAuth = await sut.authenticate(authParams)
    expect(respAuth).toBe(null)
  })

  test('should call hash comparer with correct params.password and userModelFound.password', async () => {
    const { sut, hashComparerSpy: hashComparer } = makeAuthenticationMock()
    const hashComparerSpy = jest.spyOn(hashComparer, 'compare')
    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    await sut.authenticate(authParams)
    expect(hashComparerSpy).toHaveBeenCalledWith(authParams.password, 'any_password_hashed')
  })

  test('should throw if hash comparer throws', () => {
    const { sut, hashComparerSpy } = makeAuthenticationMock()
    jest.spyOn(hashComparerSpy, 'compare').mockRejectedValueOnce(new Error())
    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    const promise = sut.authenticate(authParams)
    expect(promise).rejects.toThrow()
  })

  test('should return null if hash comparer return false', async () => {
    const { sut, hashComparerSpy } = makeAuthenticationMock()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(async () => {
      return false
    })
    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    const respAuth = await sut.authenticate(authParams)
    expect(respAuth).toEqual(null)
  })

  test('should call createEncrypterSpy with correct return null if hash comparer return false', async () => {
    const { sut, encrypterSpy: encrypter } = makeAuthenticationMock()
    const encrypterSpy = jest.spyOn(encrypter, 'encrypt')
    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    await sut.authenticate(authParams)
    const id = 1
    expect(encrypterSpy).toHaveBeenCalledWith(id.toString())
  })

  test('should return throw if createEncrypterSpy throws', () => {
    const { sut, encrypterSpy } = makeAuthenticationMock()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    const promise = sut.authenticate(authParams)
    expect(promise).rejects.toThrow()
  })

  test('should call InsertOneUserTokenAccess with correct params', async () => {
    const { sut, insertOneUserTokenAccessSpy: insertOneUserTokenAccess } = makeAuthenticationMock()
    const insertOneUserTokenAccessSpy = jest.spyOn(insertOneUserTokenAccess, 'insertOne')
    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    await sut.authenticate(authParams)
    expect(insertOneUserTokenAccessSpy).toHaveBeenCalledWith({ idUser: 1, token: 'any_token' })
  })

  test('should return a token, userName and email', async () => {
    const { sut } = makeAuthenticationMock()

    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    const authResult = await sut.authenticate(authParams)
    expect(authResult).toEqual({
      token: 'any_token',
      userName: 'any_name',
      email: 'any_email'
    })
  })
})
