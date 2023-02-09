import { admin, UserRecord } from '../../lib/firebase'

export async function handleAuthenticate(
  authorization: string
): Promise<UserRecord | null> {
  const [, token] = authorization?.split(' ') || []

  try {
    const auth = admin.auth()
    const { uid } = await auth.verifyIdToken(token)
    console.log(uid)
    return await auth.getUser(uid)
  } catch (e) {
    return null
  }
}
