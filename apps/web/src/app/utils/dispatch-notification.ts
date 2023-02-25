import { api } from '../../lib/axios'
import { requestPermissionSendNotifications } from './request-permission-send-notifications'

async function getBrowserSubscription(
  serviceWorker: ServiceWorkerRegistration
) {
  const subscription = await serviceWorker.pushManager.getSubscription()
  return subscription
}

async function getBrowserNotificationPermission(
  serviceWorker: ServiceWorkerRegistration,
  publicKey: string
): Promise<string> {
  return await serviceWorker.pushManager.permissionState({
    applicationServerKey: publicKey,
    userVisibleOnly: true,
  })
}

async function subscribeCurrentBrowser(
  serviceWorker: ServiceWorkerRegistration,
  publicKey: string
) {
  return await serviceWorker.pushManager.subscribe({
    applicationServerKey: publicKey,
    userVisibleOnly: true,
  })
}

export async function dispatchNotification(
  serviceWorker: ServiceWorkerRegistration,
  token: string
) {
  if (!Object.hasOwn(serviceWorker, 'pushManager')) return

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  let subscription = await getBrowserSubscription(serviceWorker)

  if (!subscription) {
    const { data: publicKey } = await api.get(
      '/notifications/send/public_key',
      options
    )

    const state = await getBrowserNotificationPermission(
      serviceWorker,
      publicKey
    )

    if (state === 'granted') {
      alert(
        'Porfavor ative as notifcações para receber atualizações dos seus hábitos'
      )
      await requestPermissionSendNotifications()
      return
    }

    subscription = await subscribeCurrentBrowser(serviceWorker, publicKey)

    await api.post(
      '/notifications/register',
      {
        subscription,
      },
      options
    )
  }

  if (subscription) {
    // uncomment to testing send notification received from back-end
    // await api.post(
    //   '/notifications/send',
    //   {
    //     subscription: subscription,
    //   },
    //   options
    // )
  }
}
