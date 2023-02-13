export async function requestPermissionSendNotifications() {
  return await Notification.requestPermission()
}
