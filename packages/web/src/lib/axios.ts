import axios from 'axios'

export interface Habit {
  id: string
  title: string
  created_at: Date
}

export interface DayResponseAPI {
  possibleHabits: Habit[]
  completedHabits: string[]
}

export interface SummaryItem {
  id: string
  date: Date
  completed: number
  amount: number
}

export interface SummaryResponseAPI extends Array<SummaryItem> {}

export interface HTTPResponse<T = {}> {
  data: T
}

export const api = axios.create({
  baseURL: 'http://192.168.0.13:3333'
})
