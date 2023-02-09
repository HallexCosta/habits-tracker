export function hasTokenExpired(token: string) {
  if (!token) return true
  const now = +new Date() / 1000
  const userInBase64 = token.split('.')[1]
  const userInJSON = atob(userInBase64)
  const user = JSON.parse(userInJSON)
  if (user.exp < now) {
    console.log('Token expirou')
    return true
  }
  console.log('Token não expirou')
  return false
}
