// Service Worker for Portfolio Website
const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/glassmorphism.css',
  '/responsive.css',
  '/water.mp3',
  '/potsdamer_platz_1k.hdr',
  '/manifest.json',
  '/favicon.ico'
];

// Assets to precache
const staticAssets = [
  '/_next/static/chunks/',
  '/_next/static/css/',
  '/_next/static/media/',
  '/images/'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate worker immediately
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache core files
        return cache.addAll(urlsToCache)
          .then(() => {
            // Cache static assets
            return caches.open(CACHE_NAME + '-assets');
          })
          .then((assetsCache) => {
            console.log('Caching static assets');
            // We don't await this - it's a background process
            staticAssets.forEach(pattern => {
              fetch(pattern)
                .then(response => {
                  if (response.ok) {
                    return assetsCache.put(pattern, response);
                  }
                })
                .catch(err => console.log('Failed to cache: ' + pattern, err));
            });
          });
      })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip browser extensions and analytics
  const url = new URL(event.request.url);
  if (url.protocol === 'chrome-extension:' || 
      url.hostname === 'analytics.google.com' ||
      url.hostname === 'www.google-analytics.com') {
    return;
  }
  
  // Handle HDR texture requests specially
  if (event.request.url.includes('.hdr')) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If not in cache, try to fetch, but provide a fallback
          return fetch(event.request)
            .then(response => {
              // Cache the successful response
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, responseToCache);
                });
                return response;
              } else {
                // If fetch fails, return a placeholder HDR texture
                console.log('HDR texture fetch failed, using fallback');
                return new Response(
                  'HDR texture not available offline', 
                  { status: 200, headers: { 'Content-Type': 'text/plain' } }
                );
              }
            })
            .catch(() => {
              // Network error, return placeholder
              console.log('Network error fetching HDR texture, using fallback');
              return new Response(
                'HDR texture not available offline', 
                { status: 200, headers: { 'Content-Type': 'text/plain' } }
              );
            });
        })
    );
    return;
  }
  
  // Standard cache-first strategy for other requests
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Cache hit - return the response
        if (cachedResponse) {
          return cachedResponse;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // If both cache and network fail, try to serve the offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // For image requests, return a placeholder
            if (event.request.destination === 'image') {
              return new Response('Image not available offline', {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
              });
            }
            
            // For other resources
            return new Response('Resource not available offline', {
              status: 200,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
