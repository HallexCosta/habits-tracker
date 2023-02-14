import { HabitsTrackerLocalStorageAdapter } from './habits-tracker-local-storage-adapter'

const prefix = '@habits-tracker'
export const habitsTrackerLocalStorageAdapter =
  new HabitsTrackerLocalStorageAdapter(localStorage, prefix)
