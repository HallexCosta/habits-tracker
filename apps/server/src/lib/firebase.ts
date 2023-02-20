import admin from 'firebase-admin'
import { UserRecord } from 'firebase-admin/auth'

import { configs } from '../configs'

const { firebase } = configs
console.log(firebase.credential)
admin.initializeApp({
  credential: admin.credential.cert(firebase.credential as unknown as string),
  databaseURL: firebase.databaseURL,
})

export { admin, UserRecord }
