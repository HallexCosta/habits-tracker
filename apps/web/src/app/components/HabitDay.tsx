import React from 'react'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useState } from 'react'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'

import { upperFirstCase } from '../utils/upper-first-case'

import { HabitsList } from './HabitsList'
import { ProgressBar } from './ProgressBar'

interface Props {
  date: Date
  completed?: number
  amount?: number
}
interface HabitProps {
  id: string
  title: string
}

export function HabitDay({ completed = 0, amount = 0, date }: Props) {
  const completedPercentage = generateProgressPercentage(amount, completed)

  const [upProgress, setUpProgress] = useState(completedPercentage)

  const dayAndMonth = dayjs(date).format('DD/MM')
  const dayOfWeek = upperFirstCase(dayjs(date).format('dddd'))

  function handleOnCompletedChange(habitsCompleted: number) {
    console.log(habitsCompleted)
    setUpProgress(generateProgressPercentage(amount, habitsCompleted))
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx(
          'w-10 h-10 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-[#09090A]',
          {
            'bg-zinc-900  border-zinc-800': upProgress === 0,
            'bg-violet-500/80 border-violet-500/25':
              upProgress > 0 && upProgress < 20,
            'bg-violet-600/80 border-violet-600/25':
              upProgress >= 20 && upProgress < 40,
            'bg-violet-700/80 border-violet-700/25':
              upProgress >= 40 && upProgress < 60,
            'bg-violet-800/80 border-violet-800/25':
              upProgress >= 60 && upProgress < 80,
            'bg-violet-900/80 border-violet-900/25': upProgress >= 80,
          }
        )}
      />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col text-white focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-[#09090A]">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">
            {dayAndMonth}
          </span>

          <ProgressBar progress={upProgress} />

          <Popover.Arrow className="fill-zinc-900" height={8} width={16} />

          <HabitsList date={date} onCompletedChange={handleOnCompletedChange} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
