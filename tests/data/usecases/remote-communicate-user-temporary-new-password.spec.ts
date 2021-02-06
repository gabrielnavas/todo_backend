
// const makeSendEmail = (): SendEmail => {
//   class SendEmailSpy implements SendEmail {
//     async sendOneEmail (params: SendEmail.Params): Promise<SendEmail.Result> {
//       return null
//     }
//   }
//   return new SendEmailSpy()
// }

// const makeInsertOnePasswordTemporaryByEmail = (): InsertOnePasswordTemporaryByEmail => {
//   class InsertOnePasswordTemporaryByEmailSpy implements InsertOnePasswordTemporaryByEmail {
//     async insertOne (password: string): Promise<void> { }
//   }
//   return new InsertOnePasswordTemporaryByEmailSpy()
// }

// const fakePasswordRandom = '@123!'

// const makeCreatePasswordRandomSpy = (): CreatePasswordRandom => {
//   class CreatePasswordRandomSpy implements CreatePasswordRandom {
//     handle (maxLength: number): string {
//       return fakePasswordRandom
//     }
//   }
//   return new CreatePasswordRandomSpy()
// }

const makeSut = (): SutTypes => {
  // const sendEmailSpy = makeSendEmail()
  // const insertOnePasswordTemporaryByEmailSpy = makeInsertOnePasswordTemporaryByEmail()
  // const createPasswordRandomSpy = makeCreatePasswordRandomSpy()
  const communicateUserTemporaryNewPasswordSpy = makeCommunicateUserTemporaryNewPassword()
  const loadUserAccontByEmailSpy = makeLoadUserAccontByEmail()
  const validationSpy = new ValidationSpy()
  const sut = new RecuperateUserAccountController(
    validationSpy,
    loadUserAccontByEmailSpy,
    communicateUserTemporaryNewPasswordSpy
    // createPasswordRandomSpy,
    // insertOnePasswordTemporaryByEmailSpy,
    // sendEmailSpy
  )
  return {
    sut,
    validationSpy,
    loadUserAccontByEmailSpy,
    communicateUserTemporaryNewPasswordSpy
    // createPasswordRandomSpy,
    // insertOnePasswordTemporaryByEmailSpy,
    // sendEmailSpy
  }
}

describe('RemoteCommunicateUserTemporaryNewPassword', () => {
  test('should ', () => {

  })

  // test('should call CreatePasswordRandomSpy if user exists', async () => {
  //   const { sut, createPasswordRandomSpy: createPasswordRandom } = makeSut()
  //   const createPasswordRandomSpy = jest.spyOn(createPasswordRandom, 'handle')
  //   const httpRequest = {
  //     email: 'any_email'
  //   } as RecuperateUserAccountController.HttpRequest
  //   await sut.handle(httpRequest)
  //   const maxLengthPassword = 8
  //   expect(createPasswordRandomSpy)
  //     .toHaveBeenCalledWith(maxLengthPassword)
  // })

  // test('should not call CreatePasswordRandomSpy if not found user ', async () => {
  //   const {
  //     sut,
  //     createPasswordRandomSpy: createPasswordRandom,
  //     loadUserAccontByEmailSpy
  //   } = makeSut()
  //   jest.spyOn(loadUserAccontByEmailSpy, 'loadByEmail')
  //     .mockRejectedValueOnce(null)
  //   const createPasswordRandomSpy = jest.spyOn(createPasswordRandom, 'handle')
  //   const httpRequest = {
  //     email: 'any_email'
  //   } as RecuperateUserAccountController.HttpRequest
  //   await sut.handle(httpRequest)
  //   expect(createPasswordRandomSpy).toHaveLength(0)
  // })

  // test('should call InsertOnePasswordTemporaryByEmail if user found', async () => {
  //   const {
  //     sut,
  //     insertOnePasswordTemporaryByEmailSpy: insertOnePasswordTemporaryByEmail
  //   } = makeSut()
  //   const insertOnePasswordTemporaryByEmailSpy = jest
  //     .spyOn(insertOnePasswordTemporaryByEmail, 'insertOne')
  //   const httpRequest = {
  //     email: 'any_email'
  //   } as RecuperateUserAccountController.HttpRequest
  //   await sut.handle(httpRequest)
  //   expect(insertOnePasswordTemporaryByEmailSpy)
  //     .toHaveBeenCalledWith(fakePasswordRandom)
  // })

  // test('should return serverError 500 if InsertOnePasswordTemporaryByEmail throws', async () => {
  //   const { sut, insertOnePasswordTemporaryByEmailSpy } = makeSut()
  //   jest.spyOn(insertOnePasswordTemporaryByEmailSpy, 'insertOne')
  //     .mockRejectedValueOnce(new Error('any_error'))
  //   const httpRequest = { email: 'any_email' } as RecuperateUserAccountController.HttpRequest
  //   const httpResponse = await sut.handle(httpRequest)
  //   expect(httpResponse).toEqual(httpResponseServerError(new UnexpectedError()))
  // })

  // test('should dont call InsertOnePasswordTemporaryByEmail if user not found', async () => {
  //   const {
  //     sut,
  //     insertOnePasswordTemporaryByEmailSpy: insertOnePasswordTemporaryByEmail,
  //     loadUserAccontByEmailSpy
  //   } = makeSut()
  //   jest.spyOn(loadUserAccontByEmailSpy, 'loadByEmail')
  //     .mockRejectedValueOnce(null)
  //   const insertOnePasswordTemporaryByEmailSpy = jest
  //     .spyOn(insertOnePasswordTemporaryByEmail, 'insertOne')
  //   const httpRequest = {
  //     email: 'any_email'
  //   } as RecuperateUserAccountController.HttpRequest
  //   await sut.handle(httpRequest)
  //   expect(insertOnePasswordTemporaryByEmailSpy)
  //     .toHaveLength(0)
  // })

  // test('should call SendEmail with correct params if user found', async () => {
  //   const { sut, sendEmailSpy: sendEmail } = makeSut()
  //   const sendEmailSpy = jest.spyOn(sendEmail, 'sendOneEmail')
  //   const httpRequest = {
  //     email: 'any_email'
  //   } as RecuperateUserAccountController.HttpRequest
  //   await sut.handle(httpRequest)
  //   const paramsSendEmail = {
  //     from: 'any_email@email.com',
  //     to: ['any_email01@email.com', 'any_email02@email.com', 'any_email03@email.com'],
  //     subject: 'any_subject',
  //     text: 'any_text',
  //     html: '<h1>any_html</h1>'
  //   } as SendEmail.Params
  //   expect(sendEmailSpy).toHaveBeenCalledWith(paramsSendEmail)
  // })
})
