import React, { FunctionComponent, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { hasTokenExpired } from '../utils/has-token-expired'
import { getLocalStorageData } from '../utils/get-local-storage-data'

interface SignInModalProps {
  openedModal: boolean
  children: React.ReactNode
}
export function Buttons({ children }: { children: React.ReactNode }) {
  return (
    <section aria-label="Sign-in buttons" className="mt-10 flex flex-row gap-4">
      {children}
    </section>
  )
}
export function Title({ children }: { children: React.ReactNode }) {
  return <Dialog.Title className="text-3xl font-bold">{children}</Dialog.Title>
}

export function SignInModal({ openedModal, children }: SignInModalProps) {
  return (
    <Dialog.Root open={openedModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="w-screen h-screen bg-black/80 absolute inset-0"></Dialog.Overlay>

        <Dialog.Content className="absolute p-10 text-white bg-zinc-900 w-fit rounded-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-black">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
