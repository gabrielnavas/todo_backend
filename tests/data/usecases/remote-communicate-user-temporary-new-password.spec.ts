import {
  CreatePasswordRandom
} from '@/data/interfaces/create-password-random'
import {
  RemoteCommunicateUserTemporaryNewPassword
} from '@/data/usecases/remote-communicate-user-temporary-new-password'
import { InsertOnePasswordTemporaryByEmailRepository } from '@/data/interfaces/insert-one-password-temporary-by-email-repository'
import { SendEmail } from '@/data/interfaces/send-email'
import { makeHasherSpy } from '../mocks/mock-hasher'
import { Hasher } from '../interfaces'

const fakePasswordRandom = '@123!'
const passwordHashed = 'any_hash'

const makeCreatePasswordRandomSpy = (): CreatePasswordRandom => {
  class CreatePasswordRandomSpy implements CreatePasswordRandom {
    async createPasswordRandomWithLength (maxLength: number): Promise<string> {
      return fakePasswordRandom
    }
  }
  return new CreatePasswordRandomSpy()
}

const makeInsertOnePasswordTemporaryRepositoryByEmail = (): InsertOnePasswordTemporaryByEmailRepository => {
  class InsertOnePasswordTemporaryByEmailRepositorySpy
  implements InsertOnePasswordTemporaryByEmailRepository {
    async insertOne (params: InsertOnePasswordTemporaryByEmailRepository.Params):
      Promise<InsertOnePasswordTemporaryByEmailRepository.Result> {
      return {
        idTemporaryPassword: 1,
        idUser: 1,
        passwordTemporary: passwordHashed
      }
    }
  }
  return new InsertOnePasswordTemporaryByEmailRepositorySpy()
}

const maxLengthPassword = 8
const userEmail = 'any_email'

const makeSendEmail = (): SendEmail => {
  class SendEmailSpy implements SendEmail {
    constructor (
      private readonly from: string,
      private readonly to: string[],
      private readonly subject: string
    ) {}

    async sendOneEmail (params: SendEmail.Params): Promise<SendEmail.Result> {
      return {
        idMessageSend: 'any_message_id'
      }
    }
  }
  const from = 'no-reply@todolist.com'
  const to = [userEmail]
  const subject = 'Your title'
  return new SendEmailSpy(from, to, subject)
}

type SutTypes = {
  sut: RemoteCommunicateUserTemporaryNewPassword
  createPasswordRandomSpy: CreatePasswordRandom
  hasherSpy: Hasher
  insertOnePasswordTemporaryByEmailRepositorySpy: InsertOnePasswordTemporaryByEmailRepository
  sendEmailSpy: SendEmail
}

const makeSut = (): SutTypes => {
  const createPasswordRandomSpy = makeCreatePasswordRandomSpy()
  const hasherSpy = makeHasherSpy(passwordHashed)
  const insertOnePasswordTemporaryByEmailRepositorySpy = makeInsertOnePasswordTemporaryRepositoryByEmail()
  const sendEmailSpy = makeSendEmail()
  const sut = new RemoteCommunicateUserTemporaryNewPassword(
    maxLengthPassword,
    createPasswordRandomSpy,
    hasherSpy,
    insertOnePasswordTemporaryByEmailRepositorySpy,
    sendEmailSpy
  )
  return {
    sut,
    createPasswordRandomSpy,
    hasherSpy,
    insertOnePasswordTemporaryByEmailRepositorySpy,
    sendEmailSpy
  }
}

describe('RemoteCommunicateUserTemporaryNewPassword', () => {
  test('should call CreatePasswordRandomSpy with correct maxLengthPassword if user exists', async () => {
    const {
      sut,
      createPasswordRandomSpy: createPasswordRandom
    } = makeSut()
    const createPasswordRandomSpy = jest.spyOn(createPasswordRandom, 'createPasswordRandomWithLength')
    const sutParams = {
      id: 1,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    await sut.handle(sutParams)

    expect(createPasswordRandomSpy)
      .toHaveBeenCalledWith(maxLengthPassword)
  })

  test('should retun throw if CreatePasswordRandomSpy throws', () => {
    const { sut, createPasswordRandomSpy } = makeSut()
    jest.spyOn(createPasswordRandomSpy, 'createPasswordRandomWithLength')
      .mockRejectedValue(new Error('any_error'))
    const sutParams = {
      id: 1,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const promise = sut.handle(sutParams)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should call InsertOnePasswordTemporaryByEmail if user found', async () => {
    const {
      sut,
      insertOnePasswordTemporaryByEmailRepositorySpy: insertOnePasswordTemporaryByEmailRepository
    } = makeSut()
    const insertOnePasswordTemporaryByEmailRepositorySpy = jest
      .spyOn(insertOnePasswordTemporaryByEmailRepository, 'insertOne')
    const sutParams = {
      id: 1,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    await sut.handle(sutParams)
    expect(insertOnePasswordTemporaryByEmailRepositorySpy)
      .toHaveBeenCalledWith({
        idUser: sutParams.id,
        passwordTemporary: passwordHashed
      })
  })

  test('should call hasher with correct password', async () => {
    const { sut, hasherSpy: hasher } = makeSut()
    const hasherSpy = jest.spyOn(hasher, 'hash')
    const sutParams = {
      id: 1,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    await sut.handle(sutParams)
    expect(hasherSpy).toHaveBeenCalledWith(fakePasswordRandom)
  })

  test('should return throw if hasher throws', async () => {
    const { sut, hasherSpy: hasher } = makeSut()
    jest.spyOn(hasher, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
    const sutParams = {
      id: 1,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const promise = sut.handle(sutParams)
    expect(promise).rejects.toThrow(new Error())
  })

  test('should return throws if InsertOnePasswordTemporaryByEmail throws', async () => {
    const { sut, insertOnePasswordTemporaryByEmailRepositorySpy } = makeSut()
    jest.spyOn(insertOnePasswordTemporaryByEmailRepositorySpy, 'insertOne')
      .mockRejectedValueOnce(new Error('any_error'))
    const sutParams = {
      id: 1,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const promise = sut.handle(sutParams)
    expect(promise).rejects.toThrow(new Error('any_error'))
  })

  test('should call SendEmail with correct params if user found', async () => {
    const { sut, sendEmailSpy: sendEmail } = makeSut()
    const sendEmailSpy = jest.spyOn(sendEmail, 'sendOneEmail')
    const sutParams = {
      id: 1,
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    }
    const nameUpperCase = sutParams.name.toUpperCase()[0] +
      sutParams.name.split('').splice(1).join('')
    await sut.handle(sutParams)
    expect(sendEmailSpy).toHaveBeenCalledWith({
      text: `Hello ${nameUpperCase}.`,
      html: `
        <h1>Hello ${nameUpperCase}</h1>
        This is your a new temporary password: ${fakePasswordRandom}
      `,
      to: ['any_email@email.com']
    })
  })

  test('should return throws if SendEmail throws', () => {
    const { sut, sendEmailSpy } = makeSut()
    jest.spyOn(sendEmailSpy, 'sendOneEmail')
      .mockRejectedValueOnce(new Error('any_error'))
    const sutParams = {
      id: 1,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const promise = sut.handle(sutParams)
    expect(promise).rejects.toThrow()
  })

  test('should return void if ok', async () => {
    const { sut } = makeSut()
    const sutParams = {
      id: 1,
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const response = await sut.handle(sutParams)
    expect(response).toEqual(undefined)
  })
})
