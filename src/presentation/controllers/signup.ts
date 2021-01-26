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
import { Authentication } from '@/domain/usecases/authentication'

export class SignUpController implements Controller {
  constructor (
    private readonly validateBody: Validation,
    private readonly userInsertOne: CreateUserAccount,
    private readonly getAuthentication: Authentication
  ) {}

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    try {
      const error = this.validateBody.validate(httpRequest.body)
      if (error) return httpResponseBadRequest(error)
      const { passwordConfirmation, ...userParams } = httpRequest.body
      const userCreatedOk = await this.userInsertOne.createUser(userParams)
      if (!userCreatedOk) return httpResponseBadRequest(new EmailInUseError())
      const { email, password } = httpRequest.body
      const authResult = await this.getAuthentication.authenticate({ email, password })
      return httpResponseOk(authResult)
    } catch (error) {
      return httpResponseServerError()
    }
  }
}
