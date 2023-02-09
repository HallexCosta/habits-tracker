import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
    const { habitsRoutes } = await import(`./habits`)
    const { usersRoutes } = await import(`./users`)
    await usersRoutes(app)
    await habitsRoutes(app)
}