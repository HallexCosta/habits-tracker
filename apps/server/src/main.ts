import { app } from './app'

const port = process.env.PORT ? Number(process.env.PORT) : 3333

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
