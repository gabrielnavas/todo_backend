export type HttpRequest<Body = any> = {
  body?: Body
}

export type HttpResponse<Body = any> = {
  body: Body
  statusCode: number
}
