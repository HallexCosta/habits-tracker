import fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './app/routes'

const port = process.env.PORT ? Number(process.env.PORT) : 3333

const app = fastify()

app.register(cors)
app.register(appRoutes)

const start = async () => {
  try {
    await app.listen({ port })
    console.log(`[ ready ] http://localhost:${port}`)
  } catch (err) {
    // Errors are logged here
    console.log(err)
    process.exit(1)
  }
}

start()
