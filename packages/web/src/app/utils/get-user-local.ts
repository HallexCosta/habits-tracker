interface UserLocal {
  id: string
  email: string
  name: string
  password: string | null
  photoURL: string | null
}
export function getUserLocal(): UserLocal {
  const userInJSON = localStorage.getItem('userLogged') || ''
  const user = JSON.parse(userInJSON)
  return user
}
