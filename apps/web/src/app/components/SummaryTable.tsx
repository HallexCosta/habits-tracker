import React from 'react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { api } from '../../lib/axios'
import { Summary } from '../domains'

import { AxiosResponseSuccessAdapter } from '../../lib/axios/axios-interceptor-response-adapter'
import { generateDatesFromBeginning } from '../utils/generate-dates-from-beginning'
import { getLocalStorageData } from '../utils/get-local-storage-data'
import { HabitDay } from './HabitDay'
import { WeekDay } from './WeekDay'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromBeginning()
const minimiumSummaryDatesSize = 18 * 7 // 18 weeks
const amountOfDaysToFill = minimiumSummaryDatesSize - summaryDates.length

interface SummaryTableProps {
  isOpenModal: boolean
}
export function SummaryTable({ isOpenModal }: SummaryTableProps) {
  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    console.log('Estou sendo chamado')
    if (!isOpenModal) {
      console.log('Estou buscando o usuário')
      const { token } = getLocalStorageData<UserLogged>('user-logged')
      console.log(token)

      api
        .get<Summary>('/summary', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((response: AxiosResponseSuccessAdapter<Summary>) => {
          console.log(response)
          setSummary(response.data)
        })
        .catch((e) => console.log(e))
    }
  }, [isOpenModal])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => (
          <WeekDay key={`${weekDay}-${index}`}>{weekDay}</WeekDay>
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {/* Only execute when terminated API request */}
        {summary.length > 0 &&
          summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, 'day')
            })

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amount={dayInSummary?.amount}
                completed={dayInSummary?.completed}
              />
            )
          })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, index) => {
            return (
              <div
                key={index}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              />
            )
          })}
      </div>
    </div>
  )
}
