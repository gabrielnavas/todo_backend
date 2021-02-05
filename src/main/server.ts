import 'module-alias/register'

import app from '@/main/configs/app'
import env from '@/main/configs/env'

const port = env.serverPort

const funcExec = () => {
  if (['development'].includes(env.nodeEnv)) {
    console.log(`
      [ * ] SERVER RUNNING IN ${port} 
      [ * ] THIS USE BUILD /dist 
      [ * ] FOR CHANGE TO DEV OR TESTING:
        package.json -> 
          "_moduleAliases": {
            "@": "dist"
          }
          to 
          "_moduleAliases": {
            "@": "src"
          }
    `)
    return
  }
  console.log(`[ * ] SERVER RUNNING IN ${port}`)
}

app.listen(port, funcExec)
