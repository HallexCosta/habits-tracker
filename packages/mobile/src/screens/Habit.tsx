import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { View, ScrollView, Text } from 'react-native'
import { useRoute } from '@react-navigation/native'

import { BackButton } from '../components/BackButton'
import { ProgressBar } from '../components/ProgressBar'
import { CheckBox } from '../components/CheckBox'
import { api } from '../lib/axios'
import { upperFirstCase } from '../utils/upper-first-case'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'

interface Params {
  date: string
}

interface Habit {
  id: string
  title: string
  created_at: Date
}

interface DayResponseAPI {
  possibleHabits: Habit[]
  completedHabits?: string[]
}

export function Habit() {
  const defaultEmptyDay = {
    completedHabits: [],
    possibleHabits: []
  }

  const route = useRoute()
  const { date } = route.params as Params

  const [upProgress, setUpProgress] = useState<number>(0)
  const [day, setDay] = useState<DayResponseAPI>(defaultEmptyDay)

  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMoth = parsedDate.format('DD/MM')

  function handleCompleteHabbit(habitId: string) {
    setDay((prevState) => {
      const newCompletedHabits = []

      if (prevState.completedHabits?.includes(habitId)) {
        const allCompletedHabitsWithoutRemovedHabitId = prevState.completedHabits.filter(completedHabitId=> completedHabitId !== habitId)
        newCompletedHabits.push(...allCompletedHabitsWithoutRemovedHabitId)
      } else {
        const restCompletedHabits = prevState.completedHabits || []
        newCompletedHabits.push(habitId)
        newCompletedHabits.push(...restCompletedHabits)
      }

      return {
        ...prevState,
        completedHabits: newCompletedHabits
      }
    })
  }
  function handleUpProgressBar(day: DayResponseAPI) {
    setUpProgress(
      generateProgressPercentage(
        day.possibleHabits.length, 
        day.completedHabits?.length
      )
    )
  }

  useEffect(() => {
    api.get<DayResponseAPI>(`/days?date=${date}`)
      .then(response => {
        const day = response.data || defaultEmptyDay
        setDay(day)
        handleUpProgressBar(day)
      })
      .catch(e => console.log(e.message))
  }, [])

  useEffect(() => {
    handleUpProgressBar(day)
    console.log(day.completedHabits?.length, day.possibleHabits.length)
  }, [day.completedHabits])

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <View>
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {upperFirstCase(dayOfWeek)}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMoth}
        </Text>

        <ProgressBar progress={upProgress} />

        <ScrollView 
          className="mt-6 mb-6"
          showsVerticalScrollIndicator={false}
        >
          {day.possibleHabits.map(habit => {
            const isCompleted = !!day.completedHabits?.find(habitId => habitId === habit.id) ||  false

            return (
              <CheckBox 
                key={habit.id}
                title={habit.title}
                checked={isCompleted}
                onPress={() => handleCompleteHabbit(habit.id)}
              />
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}
