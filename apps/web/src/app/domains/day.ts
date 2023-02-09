import { Habit } from './habit'

export interface Day {
  possibleHabits: Habit[]
  completedHabits: string[]
}
