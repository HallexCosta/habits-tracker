import { View, Text, ScrollView, Alert } from 'react-native'
import dayjs from 'dayjs'

import { generateDatesFromBeginning } from '../utils/generate-dates-from-beginning'

import { HabitDay, DAY_SIZE } from '../components/HabitDay'
import { Header } from '../components/Header'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { Loading } from '../components/Loading'

const weekDays = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S'
]

const datesFromYearStart = generateDatesFromBeginning()
const minimumSummaryDatesSize = 18 * 5
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length

interface SummaryItem {
  id: string
  date: Date
  completed: number
  amount: number
}

interface SummaryResponseAPI extends Array<SummaryItem> {}

export function Home() {
  const today = dayjs()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryResponseAPI>([])

  const { navigate } = useNavigation()

  async function fetchData() {
    try {
      setLoading(true)
      const response = await api.get(`/summary?date=${today.toISOString()}`)
      setSummary(response.data)
    } catch (e) {
      Alert.alert('Ops', 'Não foi possivel carregar o sumário de hábitos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useFocusEffect(useCallback(() => {
    fetchData()
  }, []))

  if (loading) {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index) => (
        <Text 
          key={index} 
          className="text-zinc-400 text-xl font-bold text-center mx-1"
          style={{ width: DAY_SIZE }}
        >
          {weekDay}
        </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map(date => {
            const currentDate = dayjs(date)
            const dayWithHabits = summary.find(day => currentDate.isSame(day.date, 'day'))

            return (
              <HabitDay 
                key={date.toISOString()}
                amountOfHabbits={dayWithHabits?.amount}
                amountCompleted={dayWithHabits?.completed}
                date={date}
                onPress={() => navigate('habit', {
                  date: date.toISOString()
                })}
              />
            )
          })}

          {
            amountOfDaysToFill > 0 && Array
              .from({ length: amountOfDaysToFill })
              .map((_, index) => {
                return (
                  <View 
                    key={index}
                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40" 
                    style={{ width: DAY_SIZE, height: DAY_SIZE }}
                  />
                )
              })
          }
        </View>
      </ScrollView>
    </View>
  )
}
