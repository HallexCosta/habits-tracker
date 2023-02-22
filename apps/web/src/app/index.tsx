// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import '../lib/dayjs'
import '../styles/global.css'
import { logoutUserWhenTokenExpire } from './utils/logout-user-when-token-expire'

import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'

import { registerServiceWorker } from './utils/register-service-worker'
import { dispatchNotification } from './utils/dispatch-notification'
import { habitsTrackerLocalStorageAdapter } from './adapters/localStorage'
import { isUserLoggedAtom } from './states/is-user-logged'
import { SignInModal } from './components/SignInModal'

async function loadServiceWorker(token: string) {
  const serviceWorker = await registerServiceWorker('service-worker.js')
  await dispatchNotification(serviceWorker, token)
}

export function App() {
  const [isUserLogged, setIsUserLogged] = useAtom(isUserLoggedAtom)

  const userLogged =
    habitsTrackerLocalStorageAdapter.getItem<UserLogged>('user-logged')

  useEffect(() => {
    logoutUserWhenTokenExpire(() => {
      setIsUserLogged(false)
      console.log('deslogando o usuário')
    })

    if (isUserLogged) {
      loadServiceWorker(userLogged.token)
    }
  }, [isUserLogged])

  return (
    <div className="w-screen h-screen flex justify-center items-center text-white">
      <SignInModal />

      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />

        <SummaryTable />
      </div>
    </div>
  )
}
