import { atom } from 'jotai'
import { habitsTrackerLocalStorageAdapter } from '../adapters/localStorage'
import { hasTokenExpired } from '../utils/has-token-expired'

const userLogged =
  habitsTrackerLocalStorageAdapter.getItem<UserLogged>('user-logged')
const isTokenExpired = hasTokenExpired(userLogged.token || '')

export const isUserLoggedAtom = atom(!isTokenExpired)
