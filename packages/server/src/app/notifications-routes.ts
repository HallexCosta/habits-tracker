import * as WebPush from 'web-push'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'

const publicKey =  process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY

WebPush.setVapidDetails(
  'http://192.168.0.13:3333',
  publicKey,
  privateKey
)

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public-key', () => {
    return {
      publicKey
    }
  })

  app.post('/push/register', (request, reply) => {
    console.log(request.body)

    // register on database
    // ...

    return reply.status(201).send()
  })

  app.post('/push/send', (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    })

    const { subscription } = sendPushBody.parse(request.body)
    
    // dispatch notification for all users online
    WebPush.sendNotification(subscription as WebPush.PushSubscription, '123213HELLO DO BACKEND')

    return reply.status(201).send()
  })
}

