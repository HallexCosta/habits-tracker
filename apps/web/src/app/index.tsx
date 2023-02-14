// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react'

import '../lib/dayjs'
import '../styles/global.css'
import { api } from '../lib/axios'
import { app } from '../lib/firebase'

import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'
import * as Modal from './components/SignInModal'

import { registerServiceWorker } from './utils/register-service-worker'
import { dispatchNotification } from './utils/dispatch-notification'
import { getLocalStorageData } from './utils/get-local-storage-data'
import { hasTokenExpired } from './utils/has-token-expired'

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  getAuth,
} from 'firebase/auth'

import { GitHub, Google, Email } from '@mui/icons-material'
import { AxiosResponseSuccessAdapter } from '../lib/axios/axios-interceptor-response-adapter'

// Dict is abbreviation to Dictonary
type DictSignInMethodKeysAllow = 'google' | 'github' | 'email'

type DictSignInMethodsActionAllow =
  | GoogleAuthProvider
  | GithubAuthProvider
  | EmailAuthProvider

type DictSignIn = {
  [key in DictSignInMethodKeysAllow]: DictSignInMethodsActionAllow
}

async function loadServiceWorker(token: string) {
  const serviceWorker = await registerServiceWorker('service-worker.js')
  await dispatchNotification(serviceWorker, token)
}

export function App() {
  const { token } = getLocalStorageData<UserLogged>('user-logged')
  const openedModal = hasTokenExpired(token || '')
  const [openModal, setOpenModal] = useState(openedModal)

  async function handleSignInWithFirebase(method: DictSignInMethodKeysAllow) {
    const allowAuthMethods: DictSignIn = {
      google: new GoogleAuthProvider(),
      github: new GithubAuthProvider(),
      email: new EmailAuthProvider(),
    }
    const authProvider = allowAuthMethods[method]
    const auth = getAuth(app)

    const userCredentials = await signInWithPopup(auth, authProvider)

    if (userCredentials) {
      const forceRefresh = true
      const token = await userCredentials.user.getIdToken(forceRefresh)

      const userAlreadyLogged = getLocalStorageData<UserLogged>('user-logged')
      let userResponse: AxiosResponseSuccessAdapter<{
        user: UserLogged['user']
      }>

      const options = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }

      if (userAlreadyLogged) {
        userResponse = await api.post('/users/auth', {}, options)
        alert('Sucesso no login - usuário autenticado')
      } else {
        const userBody = {
          name: userCredentials.user.displayName,
          email: userCredentials.user.email,
          photoURL: userCredentials.user.photoURL,
        }

        userResponse = await api.post('/users', userBody, options)
        alert('Sucesso no login - usuário criado')
      }

      localStorage.setItem(
        '@habits-tracker:user-logged',
        JSON.stringify({
          user: userResponse.data.user,
          token,
        })
      )
      setOpenModal(false)
      alert('Sucesso no login - usuário criado')
      return
    }
  }

  useEffect(() => {
    if (!openModal) {
      loadServiceWorker(token)
    }
  }, [openModal])

  return (
    <div className="w-screen h-screen flex justify-center items-center text-white">
      <Modal.SignInModal openedModal={openModal}>
        <Modal.Title>Faça login</Modal.Title>

        <Modal.Buttons>
          <button
            onClick={() => handleSignInWithFirebase('github')}
            className="rounded-md bg-zinc-800 flex gap-2 items-center justify-center p-4 font-semibold leading-tight border-1 border-white outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-black"
          >
            <GitHub />
            Github
          </button>

          <button
            onClick={() => handleSignInWithFirebase('google')}
            className="rounded-md bg-zinc-800 flex gap-2 items-center justify-center p-4 font-semibold leading-tight border-1 border-white outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Google />
            Google
          </button>

          <button
            onClick={() => handleSignInWithFirebase('email')}
            className="rounded-md bg-zinc-800 flex gap-2 items-center justify-center p-4 font-semibold leading-tight border-1 border-white outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Email />
            Email
          </button>
        </Modal.Buttons>
      </Modal.SignInModal>

      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />

        <SummaryTable isOpenModal={openModal} />
      </div>
    </div>
  )
}
