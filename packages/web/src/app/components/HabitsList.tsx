import { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { api } from '../../lib/axios'
import { Day } from '../domains/day'
import { AxiosResponseSuccessAdapter } from '../../lib/axios/axios-interceptor-response-adapter'
import { getLocalStorageData } from '../utils/get-local-storage-data'

import { CheckBox } from './CheckBox'

interface HabitsListProps {
  date: Date
  onCompletedChange: (habitsCompleted: number) => void
}

export function HabitsList({ date, onCompletedChange }: HabitsListProps) {
  const defaultDay = {
    possibleHabits: [],
    completedHabits: [],
  }

  const [loading, setLoading] = useState(true)
  const [day, setDay] = useState<Day>(defaultDay)

  const currentDate = new Date()
  const dateEndOfDay = dayjs(date).endOf('day')
  const isDateInPast = dateEndOfDay.isBefore(currentDate)

  async function handleToggleHabit(habitId: string) {
    const { token } = getLocalStorageData<UserLogged>('userLogged')

    const url = `/habits/${habitId}/toggle`
    const noBody = {}
    await api.patch(url, noBody, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    const isHabitAlreadyCompleted = day.completedHabits.includes(habitId)

    setDay((prevDay) => {
      let completedHabits: string[] = [...prevDay.completedHabits, habitId]

      if (isHabitAlreadyCompleted) {
        completedHabits = prevDay.completedHabits.filter(
          (completedHabitId) => !completedHabitId.includes(habitId)
        )
      }

      // up progress bar
      onCompletedChange(completedHabits.length)

      return {
        possibleHabits: prevDay.possibleHabits,
        completedHabits,
      }
    })
  }

  useEffect(() => {
    const { token } = getLocalStorageData<UserLogged>('userLogged')

    const getDayURL = `days`
    api
      .get<Day>(getDayURL, {
        params: {
          date: date.toISOString(),
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponseSuccessAdapter<Day>) => {
        setDay(response.data)
        setLoading(false)
      })
  }, [date])

  return (
    <div className="mt-6 flex flex-col gap-3">
      {loading && (
        <h2 className="w-64 text-white text-3xl font-bold leading-tight">
          Carregando...
        </h2>
      )}

      {!loading && day.possibleHabits.length === 0 ? (
        <h2 className="w-64 text-white text-3xl font-bold leading-tight">
          Não há hábitos nesses dias
        </h2>
      ) : (
        day.possibleHabits.map((possibleHabit) => {
          const isCompletedHabit = day.completedHabits.includes(
            possibleHabit.id
          )

          return (
            <CheckBox
              key={possibleHabit.id}
              completed={isCompletedHabit}
              title={possibleHabit.title}
              disabled={isDateInPast}
              onCheckedChange={() => handleToggleHabit(possibleHabit.id)}
            />
          )
        })
      )}
    </div>
  )
}
