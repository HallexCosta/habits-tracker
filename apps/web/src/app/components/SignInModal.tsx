import React, { useEffect } from 'react'
import { useAtom } from 'jotai'
import {
  EmailAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth'
import { GitHub, Google, Email } from '@mui/icons-material'

import { isUserLoggedAtom } from '../states/is-user-logged'
import { api, AxiosResponseSuccessAdapter } from '../../lib/axios'

import { app } from '../../lib/firebase'
import { habitsTrackerLocalStorageAdapter } from '../adapters/localStorage'

import * as Modal from './Modal'
// Dict is abbreviation to Dictonary
type DictSignInMethodKeysAllow = 'google' | 'github' | 'email'

type DictSignInMethodsActionAllow =
  | GoogleAuthProvider
  | GithubAuthProvider
  | EmailAuthProvider

type DictSignIn = {
  [key in DictSignInMethodKeysAllow]: DictSignInMethodsActionAllow
}

export function SignInModal() {
  const [isUserLogged, setIsUserLogged] = useAtom(isUserLoggedAtom)

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
    userCredential: UserCredential,
    options: { headers: { authorization: string } }
  ): Promise<
    AxiosResponseSuccessAdapter<{
      user: UserLogged['user']
    }>
  > {
    const userBody = {
      name: userCredential.user.displayName,
      email: userCredential.user.email,
      photoURL: userCredential.user.photoURL,
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
    const undoListenOnDeleteStorage =
      habitsTrackerLocalStorageAdapter.listenOnDeleteStorage({
        key: 'user-logged',
        onDeleteStorage() {
          setIsUserLogged(false)
        },
      })

    return undoListenOnDeleteStorage
  }, [])

  return (
    <Modal.Box open={!isUserLogged}>
      <Modal.Main title="Faça login">
        <section
          aria-label="Sign-in buttons"
          className="mt-10 flex flex-row gap-4"
        >
          <button
            onClick={() => handleSignInWithFirebase('google')}
            className="rounded-md bg-zinc-800 flex gap-2 items-center justify-center p-4 font-semibold leading-tight border-1 border-white outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Google />
            Google
          </button>

          <button
            onClick={() => handleSignInWithFirebase('github')}
            className="rounded-md bg-zinc-800 flex gap-2 items-center justify-center p-4 font-semibold leading-tight border-1 border-white outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-black"
          >
            <GitHub />
            Github
          </button>

          <button
            onClick={() => handleSignInWithFirebase('email')}
            className="rounded-md bg-zinc-800 flex gap-2 items-center justify-center p-4 font-semibold leading-tight border-1 border-white outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-black"
          >
            <Email />
            Email
          </button>
        </section>
      </Modal.Main>
    </Modal.Box>
  )
}
