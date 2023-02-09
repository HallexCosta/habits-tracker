import dayjs from "dayjs"
import { useState, useEffect } from "react"
import { api, DayResponseAPI, HTTPResponse } from "../../lib/axios"
import { CheckBox } from "./CheckBox"

interface HabitsListProps {
  date: Date
  onCompletedChange: (habitsCompleted: number) => void
}

export function HabitsList({ date, onCompletedChange }: HabitsListProps) {
  const defaultDay = {
    possibleHabits: [],
    completedHabits: []
  }

  const [day, setDay] = useState<DayResponseAPI>(defaultDay)

  const currentDate = new Date()
  const dateEndOfDay = dayjs(date).endOf('day')
  const isDateInPast = dateEndOfDay.isBefore(currentDate)

  async function handleToggleHabit(habitId: string) {
    console.log('handleToggleHabit')
    const url = `/habits/${habitId}/toggle`
    await api.patch(url)

    const isHabitAlreadyCompleted = day.completedHabits.includes(habitId)

    setDay(prevDay => {
      let completedHabits: string[] = [...prevDay.completedHabits, habitId]

      if (isHabitAlreadyCompleted) {
        completedHabits =  prevDay.completedHabits
          .filter(completedHabitId => !completedHabitId.includes(habitId))
      }

      // up progress bar
      onCompletedChange(completedHabits.length)

      return {
        possibleHabits: prevDay.possibleHabits,
        completedHabits
      }
    })
  }

  useEffect(() => {
    api.get<DayResponseAPI>('days', {
      params: {
        date: date.toISOString()
      }
    })
    .then((response: HTTPResponse<DayResponseAPI>) => {
      console.log(response.data)
      setDay(response.data)
    })
  }, [])


  return (
    <div className="mt-6 flex flex-col gap-3">
      {day.possibleHabits.length == 0 && (
        <h2 className="w-64 text-white text-3xl font-bold leading-tight">Não há hábitos nesses dias</h2>
      )}

      {day.possibleHabits.map(possibleHabit => {
        const isCompletedHabit = day.completedHabits.includes(possibleHabit.id)

        return (
          <CheckBox 
            key={possibleHabit.id}
            completed={isCompletedHabit}
            title={possibleHabit.title}
            disabled={isDateInPast}
            onCheckedChange={() => handleToggleHabit(possibleHabit.id)}
          />
        )
      })}
    </div>
  )
}
