import fs from 'node:fs/promises'
import { FastifyInstance } from 'fastify'

async function autoload(app: FastifyInstance) {
  const files = await fs.readdir(__dirname)
  const allowExtensions = ['ts', 'js']

  for (const filename of files) {
    if (filename.includes('index')) continue

    const [fileName, ext, map] = filename.split('.')
    const lastLetter = fileName[fileName.length - 1]
    const hasPlural = lastLetter === 's'

    if (!hasPlural || !allowExtensions.includes(ext) || map) continue

    const routesHandler = await import(`./${filename}`)

    const invokeMethod = `${fileName}Routes`
    routesHandler[invokeMethod].call(null, app)
  }
}

export async function appRoutes(app: FastifyInstance) {
  await autoload(app)
}
