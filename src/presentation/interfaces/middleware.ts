import { HttpResponse } from './http'

export interface Middleware<T = any> {
  handle: <T>(request: T) => Promise<HttpResponse>
}
