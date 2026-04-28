/* ============================================
   Service Worker — Push/Local Notifications
   MedCore EHR Clinical Notification Service
   ============================================ */

const CACHE_NAME = 'medcore-ehr-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
]

// Install — Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate — Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch — Network-first strategy for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        return response
      })
      .catch(() => caches.match(request).then((r) => r || new Response('Offline')))
  )
})

// Push Notification handler
self.addEventListener('push', (event) => {
  let data = {
    title: 'MedCore EHR Alert',
    body: 'New clinical notification received.',
    icon: '/medcore-icon.png',
    tag: 'medcore-notification',
  }

  try {
    if (event.data) {
      data = event.data.json()
    }
  } catch (e) {
    // Use defaults
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/medcore-icon.png',
      badge: '/medcore-badge.png',
      tag: data.tag || 'medcore-notification',
      data: data.url || '/',
      actions: [
        { action: 'view', title: 'View Details' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
    })
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'dismiss') return

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.focus()
          return
        }
      }
      self.clients.openWindow(event.notification.data || '/')
    })
  )
})

// Message handler for triggering notifications from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const title = event.data.title
    const body = event.data.body
    const tag = event.data.tag || 'medcore-clinical'

    self.registration.showNotification(title, {
      body: body,
      icon: '/medcore-icon.png',
      tag: tag,
      data: '/',
    })
  }
})
