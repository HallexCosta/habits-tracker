import clsx from "clsx"
import dayjs from "dayjs"
import { Alert, Dimensions, TouchableOpacity, TouchableOpacityProps } from "react-native"
import colors from "tailwindcss/colors"
import { generateProgressPercentage } from "../utils/generate-progress-percentage"

const WEEK_DAYS = 7
const SCREEN_HORINZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BETWEEN = 8
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORINZONTAL_PADDING + 5)

interface Props extends TouchableOpacityProps {
  amountCompleted?: number
  amountOfHabbits?: number
  date?: Date
}

export function HabitDay({ amountCompleted = 0, amountOfHabbits = 0, date, ...rest }: Props) {
  let amountAccomplishedPercentage = generateProgressPercentage(amountOfHabbits, amountCompleted)
  //completedPercentege = Math.round(Math.random() * 100)
  const today = dayjs().startOf('day').toDate()
  const isCurrentDate = dayjs(date).isSame(today)

  return (
    <TouchableOpacity 
      {...rest}
      className={clsx('rounded-lg border-2 m-1', {
        'bg-violet-600 border-violet-600': amountAccomplishedPercentage <= 100,
        'bg-violet-700 border-violet-600': amountAccomplishedPercentage <= 75,
        'bg-violet-800 border-violet-700': amountAccomplishedPercentage <= 50,
        'bg-violet-900 border-violet-800': amountAccomplishedPercentage <= 25,
        'bg-zinc-900 border-zinc-800': amountAccomplishedPercentage === 0,
        'border-4 border-indigo-500/75': isCurrentDate
      })}
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      activeOpacity={.7}
    />
  )
}
