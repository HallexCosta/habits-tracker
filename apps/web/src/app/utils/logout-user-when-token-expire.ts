import { habitsTrackerLocalStorageAdapter } from '../adapters/localStorage'
import { getExpireTokenTime } from './has-token-expired'

export function logoutUserWhenTokenExpire(handleLogout: () => void) {
  const userLogged =
    habitsTrackerLocalStorageAdapter.getItem<UserLogged>('user-logged')

  const expireTimeToken = getExpireTokenTime(userLogged.token)
  // Get date in "milliseconds" and divid by 1000 to return date in "seconds"
  const nowInSeconds = Math.floor(+new Date() / 1000)
  const differenceInMinutes = expireTimeToken - nowInSeconds
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
