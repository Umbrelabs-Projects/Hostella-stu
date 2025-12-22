// Service Worker for Hostella PWA
const CACHE_NAME = 'hostella-v1';
const RUNTIME_CACHE = 'hostella-runtime-v1';
const CACHE_VERSION = 'v1';
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Assets to cache on install (static assets only)
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// URLs/patterns to NEVER cache
const NO_CACHE_PATTERNS = [
  /\/api\/v1\//,           // API endpoints
  /localhost:5000/,        // Backend API
  /127\.0\.0\.1:5000/,     // Backend API (alternative)
  /\.json$/,               // JSON files (likely API responses)
  /\/_next\/data\//,       // Next.js data routes
];

// Check if URL should be cached
function shouldCache(url) {
  // Don't cache if it matches any exclusion pattern
  for (const pattern of NO_CACHE_PATTERNS) {
    if (pattern.test(url)) {
      return false;
    }
  }
  return true;
}

// Check if request is for static asset
function isStaticAsset(url) {
  return (
    url.includes('/_next/static/') ||
    url.includes('/icons/') ||
    url.includes('/images/') ||
    url.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|woff|woff2|ttf|eot)$/i)
  );
}

// Install event - cache static assets only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Don't skip waiting immediately - let it activate naturally
        console.log('[Service Worker] Installed');
      })
      .catch((error) => {
        console.error('[Service Worker] Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Claim clients only after cleanup
        return self.clients.claim();
      })
      .then(() => {
        console.log('[Service Worker] Activated');
      })
  );
});

// Fetch event - network-first for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (unless it's a static asset from CDN)
  if (url.origin !== self.location.origin) {
    // Only cache static assets from external origins
    if (!isStaticAsset(url.href)) {
      return;
    }
  }

  // NEVER cache API calls
  if (!shouldCache(url.href)) {
    // Network-only for API calls
    event.respondWith(
      fetch(request)
        .catch(() => {
          // If network fails for API, return a proper error response
          return new Response(
            JSON.stringify({ error: 'Network request failed' }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' },
            }
          );
        })
    );
    return;
  }

  // For static assets, use cache-first strategy
  if (isStaticAsset(url.href)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              // Only cache successful responses
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
              return response;
            });
        })
    );
    return;
  }

  // For HTML pages and other content, use network-first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful responses that should be cached
        if (response && response.status === 200 && shouldCache(url.href)) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache as fallback
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If it's a navigation request and cache fails, return offline page
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          // Otherwise return a proper error
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// Background sync for offline actions (optional enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks here
      console.log('[Service Worker] Background sync triggered')
    );
  }
});

// Push notifications (optional enhancement)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    tag: 'hostella-notification',
  };

  event.waitUntil(
    self.registration.showNotification('Hostella', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
