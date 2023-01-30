import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './app/routes'
import { notificationRoutes } from './app/notifications-routes'

const PORT = 3333
const app = Fastify()

app.register(cors)
app.register(notificationRoutes)
app.register(appRoutes)

const onListen = () => console.log(`Server listening at ${PORT}`)
app.listen({
  port: PORT
}).then(onListen)

