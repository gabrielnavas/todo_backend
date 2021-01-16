import { HttpResponse } from '@/../tests/presentation/interfaces'

export const httpResponseOk = (body: any): HttpResponse => ({
  statusCode: 200,
  body
})

export const httpResponseBadRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const httpResponseServerError = (error: Error) => ({
  statusCode: 500,
  body: error
})
