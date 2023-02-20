export const webPushNotifications = {
  subject: process.env.WEB_PUSH_SUBJECT.trim(),
  publicKey: process.env.WEB_PUSH_PUBLIC_KEY.trim(),
  privateKey: process.env.WEB_PUSH_PRIVATE_KEY.trim(),
}
