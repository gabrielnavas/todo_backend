import { Middleware } from '@/presentation/interfaces'

import { Request, Response, NextFunction } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers?.['x-access-token'],
      headers: req.headers || {}
    }
    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      return next()
    }
    return res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message
    })
  }
}