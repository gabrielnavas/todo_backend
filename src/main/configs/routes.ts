import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  connectRouteWithPath(router, path.join(__dirname, '/../routes'))
}

const connectRouteWithPath = (router: Router, routePath: string) => {
  readdirSync(routePath).map(async file => {
    if (!file.endsWith('.map')) {
      const defaultImport = (await import(`../routes/${file}`)).default
      defaultImport(router)
    }
  })
}
