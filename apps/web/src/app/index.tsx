// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'

import '../lib/dayjs'
import '../styles/global.css'
import { logoutUserWhenTokenExpire } from './utils/logout-user-when-token-expire'

import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'
import * as Modal from './components/SignInModal'

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  getAuth,
  UserCredential,
} from 'firebase/auth'

import { GitHub, Google, Email } from '@mui/icons-material'

import { app } from '../lib/firebase'
import { api, AxiosResponseSuccessAdapter } from '../lib/axios'

import { registerServiceWorker } from './utils/register-service-worker'
import { dispatchNotification } from './utils/dispatch-notification'
import { habitsTrackerLocalStorageAdapter } from './adapters/localStorage'
import { isUserLoggedAtom } from './states/is-user-logged'

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
  const [isUserLogged, setIsUserLogged] = useAtom(isUserLoggedAtom)

  const userLogged =
    habitsTrackerLocalStorageAdapter.getItem<UserLogged>('user-logged')

  async function authenticateUser(options: {
    headers: { authorization: string }
  }): Promise<
    AxiosResponseSuccessAdapter<{
      user: UserLogged['user']
    }>
  > {
    return await api.post('/users/auth', {}, options)
  }
  async function createUser(
    userCredentials: UserCredential,
    options: { headers: { authorization: string } }
  ): Promise<
    AxiosResponseSuccessAdapter<{
      user: UserLogged['user']
    }>
  > {
    const userBody = {
      name: userCredentials.user.displayName,
      email: userCredentials.user.email,
      photoURL: userCredentials.user.photoURL,
    }
    return await api.post('/users', userBody, options)
  }

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

      let userResponse: AxiosResponseSuccessAdapter<{
        user: UserLogged['user']
      }>

      const options = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }

      if (habitsTrackerLocalStorageAdapter.has('user-logged')) {
        userResponse = await authenticateUser(options)
        alert('Sucesso no login - usuário autenticado')
      } else {
        userResponse = await createUser(userCredentials, options)
        if (userResponse.ok) alert('Sucesso no login - usuário criado')
        // this ensure that user will be authenticate if it already exists
        if (!userResponse.ok) userResponse = await authenticateUser(options)
      }

      const userLogged = {
        user: userResponse.data.user,
        token,
      }
      console.log(userLogged)
      habitsTrackerLocalStorageAdapter.setItem('user-logged', userLogged)

      setIsUserLogged(true)
      return
    }
  }

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
      <Modal.SignInModal>
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

        <SummaryTable />
      </div>
    </div>
  )
}
