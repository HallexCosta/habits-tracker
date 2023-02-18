import fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './app/routes'

const app = fastify()

app.register(cors)
app.register(appRoutes)

export { app }
