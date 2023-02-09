interface User {
  id: string
  email: string
  name: string
  password: string | null
  photoURL: string | null
}
declare interface UserLogged {
  user: User
  token: string
}
