function handleEncodedPayload(encodedPayload: string) {
  const regex = /-/g
  const regex2 = /_/g

  if (regex.test(encodedPayload) || regex2.test(encodedPayload))
    return decodeURIComponent(
      escape(atob(encodedPayload.replace(regex, '+').replace(regex2, '/')))
    )

  return decodeURIComponent(escape(atob(encodedPayload)))
}

export function getExpireTokenTime(token: string): number {
  if (!token) return 0
  const userInBase64 = token.split('.')[1]
  const userInJSON = handleEncodedPayload(userInBase64)
  const user = JSON.parse(userInJSON)
  return user.exp as number
}

export function hasTokenExpired(token: string) {
  if (!token) return true
  // current date in seconds
  const now = +new Date() / 1000
  const userInBase64 = token.split('.')[1]
  const userInJSON = handleEncodedPayload(userInBase64)
  const user = JSON.parse(userInJSON)
  if (user.exp < now) {
    console.log('Token expirou')
    return true
  }
  console.log('Token não expirou')
  return false
}
