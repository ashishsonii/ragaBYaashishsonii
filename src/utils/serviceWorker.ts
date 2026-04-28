/* ============================================
   Service Worker Registration & Notification API
   ============================================ */

let swRegistration: ServiceWorkerRegistration | null = null

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[MedCore] Service Workers not supported in this browser.')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })
    swRegistration = registration
    console.log('[MedCore] Service Worker registered successfully.', registration.scope)
    return registration
  } catch (error) {
    console.error('[MedCore] Service Worker registration failed:', error)
    return null
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('[MedCore] Notifications not supported.')
    return 'denied'
  }

  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'

  const permission = await Notification.requestPermission()
  return permission
}

export async function showLocalNotification(
  title: string,
  body: string,
  tag: string = 'medcore-clinical'
): Promise<void> {
  const permission = await requestNotificationPermission()

  if (permission !== 'granted') {
    console.warn('[MedCore] Notification permission not granted.')
    return
  }

  // Try via Service Worker first (more reliable)
  if (swRegistration) {
    try {
      // Send message to SW to show notification
      const sw = swRegistration.active
      if (sw) {
        sw.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          body,
          tag,
        })
        return
      }
    } catch {
      // Fallback to direct API
    }
  }

  // Fallback: Direct Notification API
  try {
    new Notification(title, {
      body,
      icon: '/medcore-icon.png',
      tag,
    })
  } catch (error) {
    console.error('[MedCore] Failed to show notification:', error)
  }
}

export function getServiceWorkerRegistration(): ServiceWorkerRegistration | null {
  return swRegistration
}
