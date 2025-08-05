// Solo Leveling Productivity App - Production Service Worker
const CACHE_NAME = 'solo-hunter-prod-v1.0';
const OFFLINE_URL = '/offline.html';

// Minimal cache for production performance
const CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching critical resources');
        // Cache resources individually to avoid failures
        const cachePromises = CACHE_URLS.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
            return Promise.resolve(); // Continue with other resources
          });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response for caching
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New quest awaits, Hunter!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'view',
        title: 'View Quest',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ],
    tag: 'hunter-notification',
    requireInteraction: true
  };
  
  event.waitUntil(
    self.registration.showNotification('Solo Hunter Alert', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync any pending data when online
      syncPendingData()
    );
  }
});

// Periodic background sync for notifications
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'hunter-reminders') {
    event.waitUntil(
      checkAndSendReminders()
    );
  }
});

// Helper function to sync pending data
async function syncPendingData() {
  try {
    // Get pending data from IndexedDB or localStorage
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        // Remove from pending list on success
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper function to check and send reminders
async function checkAndSendReminders() {
  try {
    // Check if it's time for daily reminders
    const now = new Date();
    const reminderTime = 9; // 9 AM
    
    if (now.getHours() === reminderTime) {
      await self.registration.showNotification('Daily Hunter Check-in', {
        body: 'Time to review your quests and plan your day!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'daily-reminder',
        actions: [
          {
            action: 'open-app',
            title: 'Open App'
          }
        ]
      });
    }
  } catch (error) {
    console.error('Reminder check failed:', error);
  }
}

// Helper functions for pending actions
async function getPendingActions() {
  // Implementation would use IndexedDB
  return [];
}

async function removePendingAction(id) {
  // Implementation would use IndexedDB
  return true;
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
        
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME });
        break;
        
      case 'CACHE_URLS':
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => cache.addAll(event.data.urls))
        );
        break;
        
      case 'SCHEDULE_NOTIFICATION':
        scheduleNotification(event.data.notification);
        break;
        
      default:
        console.log('Unknown message type:', event.data.type);
    }
  }
});

// Schedule notification function
function scheduleNotification(notificationData) {
  const { title, body, delay = 0, tag = 'scheduled' } = notificationData;
  
  setTimeout(() => {
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      tag,
      requireInteraction: true
    });
  }, delay);
}

console.log('Service Worker: Script loaded successfully');