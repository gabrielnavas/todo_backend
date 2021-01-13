import 'module-alias/register'

import app from '@/main/configs/app'
import env from '@/main/configs/env'

app.listen(
  env.server_port,
  () => console.log(`SERVER RUNNING IN ${env.server_port}`)
)
