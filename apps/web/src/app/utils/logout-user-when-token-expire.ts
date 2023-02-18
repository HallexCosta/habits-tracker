import { habitsTrackerLocalStorageAdapter } from '../adapters/localStorage'
import { getExpireTokenTime } from './has-token-expired'

export function logoutUserWhenTokenExpire(handleLogout: () => void) {
  const userLogged =
    habitsTrackerLocalStorageAdapter.getItem<UserLogged>('user-logged')

  const expireTimeToken = getExpireTokenTime(userLogged.token)
  const now = Math.floor(+new Date() / 1000)
  const differenceInMinutes = expireTimeToken - now
  // console.log(expireTimeToken, now)

  const timeoutInMinutes = Math.floor(differenceInMinutes / 60)
  if (timeoutInMinutes > 0) {
    console.log(`usuário vai ser deslogado em ${timeoutInMinutes} minutos`)
  } else {
    console.log(`usuário foi deslogado a ${-timeoutInMinutes} minutos atrás`)
  }

  const timeout = differenceInMinutes * 1000 // in milliseconds
  console.log(timeout)
  setTimeout(handleLogout, timeout)
}
