// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect, useRef, useState } from 'react'
import '../lib/dayjs'
import '../styles/global.css'

import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'

import { SignInModal } from './components/SignInModal'

export function App() {
  const [isOpenModal, setIsOpenModal] = useState(true)

  function handleToggleIsOpenModal(stateModal: boolean) {
    setIsOpenModal(stateModal)
    console.log('isOpenedModal')
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center text-white">
      <SignInModal onChangeIsOpenModal={handleToggleIsOpenModal} />

      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />

        <SummaryTable isOpenModal={isOpenModal} />
      </div>
    </div>
  )
}
