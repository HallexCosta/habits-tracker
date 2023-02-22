import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import habitLogo from '../../assets/habit-logo.svg'

import { Plus, X } from 'phosphor-react'

import { NewHabitForm } from './NewHabitForm'

interface Props {
  children: React.ReactNode
}

export function ButtonTrigger({ children }: Props) {
  return (
    <Dialog.Trigger className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-violet-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-[#09090A]">
      {children}
    </Dialog.Trigger>
  )
}

interface MainProps extends Props {
  title?: string
  closeModalButton?: React.ReactNode
}
export function Main({ children, title, closeModalButton }: MainProps) {
  return (
    <>
      <Dialog.Portal>
        <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />

        <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
          {closeModalButton && (
            <Dialog.Close className="absolute right-6 top-6 text-zinc-400 hover:text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-[#09090A]">
              {closeModalButton}
            </Dialog.Close>
          )}

          {title && (
            <Dialog.Title className="text-3xl leading-tight font-extrabold">
              {title}
            </Dialog.Title>
          )}

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </>
  )
}

interface BoxProps extends Props {
  open?: boolean
}

export function Box({ children, ...rest }: BoxProps) {
  return <Dialog.Root {...rest}>{children}</Dialog.Root>
}
