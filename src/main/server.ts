import app from "./configs/app";
import env from "./configs/env";

app.listen(
  env.server_port, 
  () => console.log(`SERVER RUNNING IN ${env.server_port}`)
)