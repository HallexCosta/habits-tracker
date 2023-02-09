import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { handleAuthenticate } from '../helpers/utils'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    try {
      const { uid } = await handleAuthenticate(request.headers.authorization)

      if (!uid) {
        reply.status(401)
        return {
          message: '[Unathorized]: need token from firebase to register user',
        }
      }

      const createUserBody = z.object({
        name: z.string(),
        email: z.string(),
        password: z.nullable(z.string()).optional(),
        photoURL: z.string().optional(),
      })
      const { name, email, password, photoURL } = createUserBody.parse(
        request.body
      )

      const user = {
        name,
        email,
        password,
        photoURL,
      }

      // create the user with user_details from firebase
      const userCreated = await prisma.user.create({
        data: {
          ...user,
          userDetails: {
            create: {
              firebase_uid: uid,
            },
          },
        },
        include: {
          userDetails: true,
        },
      })

      reply.status(201)
      return {
        userCreated,
      }
    } catch (e) {
      reply.status(400)
      console.log(e)
    }
  })

  app.get('/users', async () => {
    return await prisma.user.findMany()
  })

  app.post('/users/auth', async (request, reply) => {
    const { uid } = await handleAuthenticate(request.headers.authorization)

    if (!uid) {
      reply.status(401)
      return {
        message: '[Unathorized]: need token from firebase to authenticate user',
      }
    }

    // check user already registered
    const userAlreadyExists = await prisma.userDetails.findUnique({
      where: {
        firebase_uid: uid,
      },
      include: {
        user: true,
      },
    })

    if (!userAlreadyExists) {
      reply.status(400)
      return {
        message: 'User not found',
      }
    }

    return {
      user: userAlreadyExists.user,
    }
  })
}
