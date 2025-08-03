// Simple service worker for notifications
self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  event.notification.close();
  
  // Focus or open the app window
  event.waitUntil(
    clients.matchAll().then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});