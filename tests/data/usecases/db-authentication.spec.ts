import { FindOneUserByEmailRepository } from '@/data/interfaces'
import { Encrypter } from '@/data/interfaces/encrypter'
import { HashComparer } from '@/data/interfaces/hasher-comparer'
import { InsertOneUserTokenAccessRepository } from '@/data/interfaces/insert-one-user-token-access-repository'
import { DbAuthentication } from '@/data/usecases/db-authentication'
import { Authentication } from '@/domain/usecases/authentication'

const userName = 'any_name'
const token = 'any_token'

const makeUserRepository = () => {
  class UserRepositorySpy implements FindOneUserByEmailRepository {
    async findByEmail (email: FindOneUserByEmailRepository.Params): Promise<FindOneUserByEmailRepository.Result> {
      return {
        id: 1,
        email: 'any_email',
        name: userName,
        password: 'any_password_hashed'
      }
    }
  }
  return new UserRepositorySpy()
}

const makeInsertOneUserTokenAccess = (): InsertOneUserTokenAccessRepository => {
  class InsertOneUserTokenAccessSpy implements InsertOneUserTokenAccessRepository {
    insertOne = async (params: InsertOneUserTokenAccessRepository.Params): Promise<InsertOneUserTokenAccessRepository.Result> => {
      return {
        createdAt: new Date(),
        token
      }
    }
  }
  return new InsertOneUserTokenAccessSpy()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerSpy implements HashComparer {
    compare = async (plaitext: string, digest: string): Promise<boolean> => {
      return true
    }
  }
  return new HashComparerSpy()
}

const makeEncrypter = () => {
  class EncrypterSpy implements Encrypter {
    encrypt = async (plaintext: string): Promise<string> => {
      return token
    }
  }
  return new EncrypterSpy()
}

type TypeSut = {
  checkExistsUserByEmailSpy: FindOneUserByEmailRepository
  hashComparerSpy: HashComparer
  encrypterSpy: Encrypter
  insertOneUserTokenAccessSpy: InsertOneUserTokenAccessRepository
  sut: Authentication
}

const makeSut = (): TypeSut => {
  const insertOneUserTokenAccessSpy = makeInsertOneUserTokenAccess()
  const checkExistsUserByEmailSpy = makeUserRepository()
  const hashComparerSpy = makeHashComparer()
  const encrypterSpy = makeEncrypter()
  const sut = new DbAuthentication(
    checkExistsUserByEmailSpy,
    hashComparerSpy,
    encrypterSpy,
    insertOneUserTokenAccessSpy
  )
  return {
    sut,
    checkExistsUserByEmailSpy,
    hashComparerSpy,
    encrypterSpy,
    insertOneUserTokenAccessSpy
  }
}

describe('DbAuthentication', () => {
  test('should call checkEmail with correct email', async () => {
    const { sut, checkExistsUserByEmailSpy: checkExistsUserByEmail } = makeSut()
    const checkExistsUserByEmailSpySpy = jest.spyOn(checkExistsUserByEmail, 'findByEmail')
    const authParams = {
      email: 'any_email',
      password: 'any_password'
    }
    await sut.authenticate(authParams)
    expect(checkExistsUserByEmailSpySpy).toHaveBeenCalledWith(authParams.email)
  })

  test('should reject if checkEmail throws', () => {
    const { sut, checkExistsUserByEmailSpy } = makeSut()
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
    const { sut, checkExistsUserByEmailSpy } = makeSut()
    jest.spyOn(checkExistsUserByEmailSpy, 'findByEmail').mockReturnValueOnce(null)
    const authParams = {
      email: 'any_email',
      password: 'any_password'
    }
    const respAuth = await sut.authenticate(authParams)
    expect(respAuth).toBe(null)
  })

  test('should call hash comparer with correct params.password and userModelFound.password', async () => {
    const { sut, hashComparerSpy: hashComparer } = makeSut()
    const hashComparerSpy = jest.spyOn(hashComparer, 'compare')
    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    await sut.authenticate(authParams)
    expect(hashComparerSpy).toHaveBeenCalledWith(authParams.password, 'any_password_hashed')
  })

  test('should throw if hash comparer throws', () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockRejectedValueOnce(new Error())
    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    const promise = sut.authenticate(authParams)
    expect(promise).rejects.toThrow()
  })

  test('should return null if hash comparer return false', async () => {
    const { sut, hashComparerSpy } = makeSut()
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
    const { sut, encrypterSpy: encrypter } = makeSut()
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
    const { sut, encrypterSpy } = makeSut()
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
    const { sut, insertOneUserTokenAccessSpy: insertOneUserTokenAccess } = makeSut()
    const insertOneUserTokenAccessSpy = jest.spyOn(insertOneUserTokenAccess, 'insertOne')
    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    await sut.authenticate(authParams)
    expect(insertOneUserTokenAccessSpy).toHaveBeenCalledWith(token)
  })

  test('should return a token and userName', async () => {
    const { sut } = makeSut()

    const authParams = {
      email: 'any_email',
      password: 'any_other_password'
    }
    const authResult = await sut.authenticate(authParams)
    expect(authResult).toEqual({ token, userName })
  })
})
