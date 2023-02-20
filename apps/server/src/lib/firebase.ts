import admin from 'firebase-admin'
import { UserRecord } from 'firebase-admin/auth'

import { configs } from '../configs'

const { firebase } = configs

admin.initializeApp({
  credential: admin.credential.cert(firebase.credential as unknown as string),
  databaseURL: firebase.databaseURL,
})

export { admin, UserRecord }
