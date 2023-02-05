import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './app/routes'

const PORT = 3333
const app = Fastify()

app.register(cors)
app.register(appRoutes)

const onListen = () => console.log(`Server listening at ${PORT}`)
app
  .listen({
    port: PORT,
  })
  .then(onListen)
