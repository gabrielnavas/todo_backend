export type HttpRequest<Body = any> = {
  accountId?: number
  body?: Body
}

export type HttpResponse<Body = any> = {
  body: Body
  statusCode: number
}
