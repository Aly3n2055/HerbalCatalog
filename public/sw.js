// Enhanced service worker for PWA with better error handling
const CACHE_NAME = 'herbal-wellness-clinic-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/src/index.css'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened successfully');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache failed to open:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.error('Failed to cache response:', error);
              });

            return response;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData());
  }

  if (event.tag === 'order-sync') {
    event.waitUntil(syncOrderData());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Push message received');

  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('NatureVital', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for background sync
async function syncCartData() {
  try {
    // Get pending cart data from IndexedDB
    const pendingData = await getPendingCartData();

    if (pendingData.length > 0) {
      // Sync with server
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pendingData)
      });

      // Clear pending data on success
      await clearPendingCartData();
      console.log('Cart data synced successfully');
    }
  } catch (error) {
    console.error('Cart sync failed:', error);
    throw error;
  }
}

async function syncOrderData() {
  try {
    // Get pending order data from IndexedDB
    const pendingOrders = await getPendingOrderData();

    if (pendingOrders.length > 0) {
      // Sync with server
      await fetch('/api/orders/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pendingOrders)
      });

      // Clear pending data on success
      await clearPendingOrderData();
      console.log('Order data synced successfully');
    }
  } catch (error) {
    console.error('Order sync failed:', error);
    throw error;
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingCartData() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function clearPendingCartData() {
  // In a real implementation, this would clear IndexedDB
}

async function getPendingOrderData() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function clearPendingOrderData() {
  // In a real implementation, this would clear IndexedDB
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});