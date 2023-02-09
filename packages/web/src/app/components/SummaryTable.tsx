import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api, HTTPResponse, SummaryResponseAPI } from "../../lib/axios"
import { generateDatesFromBeginning } from "../utils/generate-dates-from-beginning"
import { HabitDay } from "./HabitDay"
import { WeekDay } from "./WeekDay"

const weekDays = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S'
]

const summaryDates = generateDatesFromBeginning()
const minimiumSummaryDatesSize = 18 * 7 // 18 weeks
const amountOfDaysToFill = minimiumSummaryDatesSize - summaryDates.length

export function SummaryTable() {
  const [summary, setSummary] = useState<SummaryResponseAPI>([])

  useEffect(() => {
    api.get<SummaryResponseAPI>('summary')
      .then((response: HTTPResponse<SummaryResponseAPI>) => setSummary(response.data))
  }, [])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => (
          <WeekDay 
            key={`${weekDay}-${index}`}
          >
            {weekDay}
          </WeekDay>
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {/* Only execute when terminated API request */}
        {summary.length > 0 && summaryDates.map(date => {
          const dayInSummary = summary.find(day => {
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

        {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, index) => {
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
