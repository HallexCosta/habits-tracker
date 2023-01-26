import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { setUncaughtExceptionCaptureCallback } from 'process'
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

export function HabitDay({ completed = 0, amount  = 0, date }: Props) {
  const completedPercentage = generateProgressPercentage(amount, completed)
  console.log(completedPercentage, date)

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
        className={clsx('w-10 h-10 border-2 rounded-lg', {
          'bg-zinc-900  border-zinc-800': completedPercentage === 0,
          'bg-violet-900 border-violet-700': completedPercentage > 0 && completedPercentage < 20,
          'bg-violet-800 border-violet-600': completedPercentage >= 20 && completedPercentage < 40,
          'bg-violet-700 border-violet-500': completedPercentage >= 40 && completedPercentage < 60,
          'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
          'bg-violet-500 border-violet-400': completedPercentage >= 80
        })}
      />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col text-white">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

          <ProgressBar progress={upProgress} />

          <Popover.Arrow className="fill-zinc-900" height={8} width={16} />

          <HabitsList date={date} onCompletedChange={handleOnCompletedChange} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
