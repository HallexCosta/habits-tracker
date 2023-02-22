import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import habitLogo from '../../assets/habit-logo.svg'

import { Plus, X } from 'phosphor-react'
import { NewHabitForm } from './NewHabitForm'
import * as Modal from './Modal'

export function Header() {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img src={habitLogo} alt="Habit Logo" />

      <Modal.Box>
        <Modal.ButtonTrigger>
          <Plus size={20} className="text-violet-500" />
          Novo hábito
        </Modal.ButtonTrigger>

        <Modal.Main
          closeModalButton={<X size={24} aria-label="Fechar" />}
          title="Criar hábito"
        >
          <NewHabitForm />
        </Modal.Main>
      </Modal.Box>
    </div>
  )
}
