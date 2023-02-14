import { FastifyInstance } from 'fastify'
import webPush from 'web-push'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { handleAuthenticate } from '../helpers/utils'

const pubKey = process.env.PUBLIC_KEY
const pvtKey = process.env.PRIVATE_KEY

webPush.setVapidDetails('http://192.168.0.19:3333', pubKey, pvtKey)

export function notificationsRoutes(app: FastifyInstance) {
  app.get('/notifications/send/public_key', () => {
    return pubKey
  })

  app.post('/notifications/register', async (request, reply) => {
    reply.status(400)

    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    })

    const { subscription } = sendPushBody.parse(request.body)

    const userAuth = await handleAuthenticate(request.headers.authorization)

    if (!userAuth) {
      return {
        message: '[Firebase]: token is invalid or expired',
      }
    }

    const user = await prisma.user.findFirst({
      where: {
        userDetails: {
          firebase_uid: userAuth.uid,
        },
      },
    })
    console.log(user)

    const alreadyUserBrowser = await prisma.userBrowser.findUnique({
      where: {
        user_id_browser_id: {
          browser_id: subscription.endpoint,
          user_id: user.id
        }
      },
    })

    if (alreadyUserBrowser) {
      return {
        message: 'This browser is already registered',
      }
    }

    const userBrowser = await prisma.userBrowser.create({
      data: {
        user_id: user.id,
        browser_id: subscription.endpoint,
      },
    })
    console.log(userBrowser)

    reply.status(201)
    return {
      user_browser: userBrowser,
    }
  })

  // // rota para testar envio de notificação
  app.post('/notifications/send', (request, reply) => {
    console.log(request.body)
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    })

    const { subscription } = sendPushBody.parse(request.body)

    if (!subscription) {
      reply.status(400).send()
      return {
        message: 'Please informe subscription',
      }
    }

    webPush.sendNotification(
      subscription as webPush.PushSubscription,
      'Notifição vinda do back-end'
    )
    reply.status(201).send()
  })
}
