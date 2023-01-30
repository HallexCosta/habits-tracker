// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { api } from '../lib/axios'
import '../lib/dayjs'
import '../styles/global.css'

import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'

import { requestPermission } from './notifications/request-permission'

navigator.serviceWorker.register('service-worker.js')
  .then(async serviceWorker => {
    let subscription = await serviceWorker.pushManager.getSubscription()

    if (!subscription) {
      const { data: { publicKey } } = await api.get('/push/public-key')

      const state = await serviceWorker.pushManager.permissionState({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      })
      console.log(state)

      if (['denied', 'prompt'].includes(state)) {
        alert('Porfavor ative as notifcações para receber atualizações dos seus hábitos')
        return await requestPermission()
      }

      console.log('susbscription not exists then created an')
      subscription = await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey
      })
    }

    await api.post('/push/register', {
      subscription
    })

    await api.post('/push/send', {
      subscription
    })
  })

export function App() {
  return (
    <div className="w-screen h-screen flex justify-center items-center text-white">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />

        <SummaryTable />
      </div>
    </div>
  );
}
