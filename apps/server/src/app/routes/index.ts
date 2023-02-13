import { FastifyInstance } from 'fastify'
import fs from 'node:fs/promises'

async function autoload(app: FastifyInstance) {
  const files = await fs.readdir(__dirname)

  for (const filename of files) {
    if (filename.includes('index')) continue

    const lastLetter = filename[filename.length - 1]
    const hasPlural = lastLetter === 's'
    if (!hasPlural) throw new Error('Define the files name in plural')

    const routesHandler = await import(`./${filename}`)
    const fileName = filename.split('.')[0]

    routesHandler[`${fileName}Routes`].call(null, app)
  }
}

export async function appRoutes(app: FastifyInstance) {
  await autoload(app)
}
