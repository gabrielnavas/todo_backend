import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/../tests/presentation/interfaces'
import { CreateUserAccount } from '@/domain/usecases/create-user-account'
import { Validation } from '@/validation/protocols/validation'
import {
  httpResponseBadRequest,
  httpResponseOk,
  httpResponseServerError
} from '../helpers/http-helper'

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
      if (!userCreatedOk) return httpResponseBadRequest(new Error())
      return httpResponseOk({ ok: 'ok' })
    } catch (error) {
      return httpResponseServerError(error)
    }
  }
}
