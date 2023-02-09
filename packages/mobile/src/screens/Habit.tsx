import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { View, ScrollView, Text, Pressable, Alert, ToastAndroid } from 'react-native'
import { useRoute } from '@react-navigation/native'

import { BackButton } from '../components/BackButton'
import { ProgressBar } from '../components/ProgressBar'
import { CheckBox } from '../components/CheckBox'
import { api } from '../lib/axios'
import { upperFirstCase } from '../utils/upper-first-case'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'
import { Loading } from '../components/Loading'
import { HabitsEmpty } from '../components/HabitsEmpty'
import clsx from 'clsx'

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
  completedHabits: string[]
}

export function Habit() {
  const defaultEmptyDay = {
    completedHabits: [],
    possibleHabits: []
  }

  const route = useRoute()
  const { date } = route.params as Params

  const [loading, setLoading] = useState(true)
  const [upProgress, setUpProgress] = useState<number>(0)
  const [day, setDay] = useState<DayResponseAPI>({
    completedHabits: [],
    possibleHabits: []
  })

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

  const parsedDate = dayjs(date)
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMoth = parsedDate.format('DD/MM')

  async function sendRequestToggleHabbit(habitId: string) {
    let isError = false
    try {
      await api.patch(`/habits/${habitId}/toggle`)
    } catch (e) {
      isError = true
      console.log(e)
      Alert.alert('Ops', 'Não foi possivel atualizar o status do hábito')
    }
    return {
      isError
    }
  }

  async function handleToggleHabit(habitId: string) {
    const { isError } = await sendRequestToggleHabbit(habitId)

    if (isError) return console.log('Not changing day state')

    setDay(prevState => {
      if (prevState.completedHabits.includes(habitId)) {
        const removedCompletedHabits = prevState.completedHabits
          .filter(completedHabitId=> completedHabitId !== habitId)

        return {
          possibleHabits: prevState.possibleHabits,
          completedHabits: removedCompletedHabits
        }
      }

      const completedHabits = [...prevState.completedHabits]
      completedHabits.push(habitId)

      return {
        possibleHabits: prevState.possibleHabits,
        completedHabits: completedHabits
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

  function handleShowMessadeWhenBlockHabitsList() {
    ToastAndroid.show('Não possível editar hábitos de datas que já passaram', ToastAndroid.LONG) 
  }

  useEffect(() => {
    api.get<DayResponseAPI>('/days', {
      params: {
        date
      }
    })
      .then(response => {
        const day = response.data
        setDay(day)
        handleUpProgressBar(day)
        setLoading(false)
      })
      .catch(e => {
        console.log(e.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    handleUpProgressBar(day)
    console.log(day.completedHabits?.length, day.possibleHabits.length)
  }, [day.completedHabits])

  if (loading) return <Loading />

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
          className={clsx('mt-6 mb-6', {
            ['opacity-50']: isDateInPast
          })}
          showsVerticalScrollIndicator={false}
        >
          <Pressable 
            onPress={isDateInPast ? handleShowMessadeWhenBlockHabitsList: () => {}}
          >
            {day.possibleHabits.length > 0 ? day.possibleHabits.map(habit => {
              const isCompleted = !!day.completedHabits?.find(habitId => habitId === habit.id) ||  false

              return (
                <CheckBox 
                  key={habit.id}
                  title={habit.title}
                  checked={isCompleted}
                  lineThrough={true}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              )
            })
            : (
              <HabitsEmpty weekDay={dayOfWeek} />
            )}
          </Pressable>
        </ScrollView>
      </View>
    </View>
  )
}
