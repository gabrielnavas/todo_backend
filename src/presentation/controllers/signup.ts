import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/interfaces'
import { CreateUserAccount } from '@/domain/usecases/create-user-account'
import { Validation } from '@/presentation/interfaces/validation'
import {
  httpResponseBadRequest,
  httpResponseOk,
  httpResponseServerError
} from '../helpers/http-helper'
import { EmailInUseError } from '../errors/email-in-use-error'

export class SignUpController implements Controller {
  constructor (
    private readonly validateBody: Validation,
    private readonly userInsertOne: CreateUserAccount
  ) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const error = this.validateBody.validate(httpRequest.body)
      if (error) return httpResponseBadRequest(error)
      const { passwordConfirmation, ...userParams } = httpRequest.body
      const userCreatedOk = await this.userInsertOne.createUser(userParams)
      if (!userCreatedOk) return httpResponseBadRequest(new EmailInUseError())
      return httpResponseOk()
    } catch (error) {
      return httpResponseServerError(error)
    }
  }
}
