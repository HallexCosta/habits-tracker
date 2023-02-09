import admin from 'firebase-admin'
import { UserRecord } from 'firebase-admin/auth'

import credential from '../habits-tracker-credentials.json'

admin.initializeApp({
  credential: admin.credential.cert(credential as unknown as string),
  databaseURL: 'https://habits-tracker-5f7a4-default-rtdb.firebaseio.com/',
})

export { admin, UserRecord }
