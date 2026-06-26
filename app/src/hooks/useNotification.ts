export async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false

  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false

  try {
    const perm = await Notification.requestPermission()
    return perm === 'granted'
  } catch {
    return false
  }
}

export function sendNotification(title: string, body: string): void {
  if (!('Notification' in window)) return

  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.svg' })
  }
}
