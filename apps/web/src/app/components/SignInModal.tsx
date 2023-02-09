import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { hasTokenExpired } from '../utils/has-token-expired'
import { getLocalStorageData } from '../utils/get-local-storage-data'

import { api } from '../../lib/axios'

import { app } from '../../lib/firebase'
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  getAuth,
} from 'firebase/auth'

import { GitHub, Google, Email } from '@mui/icons-material'

// Dict is abbreviation to Dictonary
type DictSignInMethodKeysAllow = 'google' | 'github' | 'email'

type DictSignInMethodsActionAllow =
  | GoogleAuthProvider
  | GithubAuthProvider
  | EmailAuthProvider

type DictSignIn = {
  [key in DictSignInMethodKeysAllow]: DictSignInMethodsActionAllow
}

interface SignInModalProps {
  onChangeIsOpenModal: (stateModal: boolean) => void
}

export function SignInModal({ onChangeIsOpenModal }: SignInModalProps) {
  const { token } = getLocalStorageData<UserLogged>('userLogged')
  const openedModal = hasTokenExpired(token || '')
  onChangeIsOpenModal(openedModal)
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
      const user = {
        name: userCredentials.user.displayName,
        email: userCredentials.user.email,
        photoURL: userCredentials.user.photoURL,
      }

      const forceRefresh = true
      const token = await userCredentials.user.getIdToken(forceRefresh)

      const authUserResponse = await api.post('/users/auth', user, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      if (authUserResponse.ok) {
        localStorage.setItem(
          'userLogged',
          JSON.stringify({
            user: authUserResponse.data.user,
            token,
          })
        )
        setOpenModal(false)
        onChangeIsOpenModal(false)
        alert('Sucesso no login - usuário autenticado')
        return
      }

      const createUserResponse = await api.post('/users', user, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      if (createUserResponse.ok) {
        JSON.stringify({
          user: authUserResponse.data.user,
          token,
        })
        setOpenModal(false)
        onChangeIsOpenModal(false)
        alert('Sucesso no login - usuário criado')
        return
      }
    }
  }
  return (
    <Dialog.Root open={openModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="w-screen h-screen bg-black/80 absolute inset-0"></Dialog.Overlay>

        <Dialog.Content className="absolute p-10 text-white bg-zinc-900 w-fit rounded-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-black">
          <Dialog.Title className="text-3xl font-bold">Faça login</Dialog.Title>

          <section
            aria-label="Sign-in buttons"
            className="mt-10 flex flex-row gap-4"
          >
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
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
