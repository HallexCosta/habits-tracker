import { app } from './app'

const port = process.env.PORT ? Number(process.env.PORT) : 3333
const host = '0.0.0.0'

const start = async () => {
  try {
    const address = await app.listen({ port, host })
    console.log(`[ ready ] http://${address}`)
  } catch (err) {
    // Errors are logged here
    console.log(err)
    process.exit(1)
  }
}

start()
