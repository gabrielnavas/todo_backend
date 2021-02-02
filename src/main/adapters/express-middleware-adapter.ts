import { Middleware } from '@/presentation/interfaces'

import { Request, Response, NextFunction } from 'express'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers?.['x-access-token']
    }
    const httpResponse = await middleware.handle(request)
    if (httpResponse.statusCode === 200) {
      const bodyContent = httpResponse.body
      Object.assign(req, bodyContent)
      return next()
    }
    return res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message
    })
  }
}
