// Service Worker pour METHODEA
// Cache intelligent et mode offline

const CACHE_NAME = 'methodea-v1';
const STATIC_CACHE = 'methodea-static-v1';
const DYNAMIC_CACHE = 'methodea-dynamic-v1';

// Ressources à mettre en cache immédiatement
const STATIC_FILES = [
  '/',
  '/index.html',
  '/assets/css/styles.min.css',
  '/assets/js/script.min.js',
  '/assets/images/og-image.webp',
  '/assets/images/og-image.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/manifest.json',
  '/pages/memoire-caferuis.html',
  '/pages/memoire-dscg.html',
  '/pages/memoire-master.html',
  '/pages/tfe-infirmier.html'
];

// Ressources dynamiques à ne pas cacher
const DYNAMIC_EXCLUDE = [
  '/api/',
  'chrome-extension://',
  'moz-extension://',
  'googletagmanager.com',
  'google-analytics.com',
  'wa.me'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installation...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Mise en cache des ressources statiques');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Ressources statiques cachées avec succès');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[SW] Erreur lors de la mise en cache:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activation...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activé');
        return self.clients.claim();
      })
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Ignorer les ressources exclues
  if (DYNAMIC_EXCLUDE.some(exclude => request.url.includes(exclude))) {
    return;
  }
  
  // Stratégie Cache First pour les ressources statiques
  if (STATIC_FILES.includes(url.pathname) || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'image') {
    
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            console.log('[SW] Ressource servie depuis le cache:', request.url);
            return response;
          }
          
          return fetch(request)
            .then(fetchResponse => {
              if (!fetchResponse || fetchResponse.status !== 200) {
                return fetchResponse;
              }
              
              const responseClone = fetchResponse.clone();
              caches.open(STATIC_CACHE)
                .then(cache => {
                  cache.put(request, responseClone);
                });
              
              return fetchResponse;
            });
        })
        .catch(() => {
          // Fallback pour les pages HTML en mode offline
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
        })
    );
  }
  
  // Stratégie Network First pour les pages HTML
  else if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              return response || caches.match('/index.html');
            });
        })
    );
  }
});

// Message du Service Worker
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    caches.open(STATIC_CACHE)
      .then(cache => cache.keys())
      .then(keys => {
        event.ports[0].postMessage({
          type: 'CACHE_SIZE',
          size: keys.length
        });
      });
  }
});

// Nettoyage périodique du cache dynamique
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then(cache => cache.keys())
        .then(keys => {
          // Garder seulement les 50 dernières entrées
          if (keys.length > 50) {
            const keysToDelete = keys.slice(0, keys.length - 50);
            return Promise.all(
              keysToDelete.map(key => 
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.delete(key))
              )
            );
          }
        })
    );
  }
});

// Gestion des erreurs
self.addEventListener('error', event => {
  console.error('[SW] Erreur Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[SW] Promise rejetée non gérée:', event.reason);
  event.preventDefault();
});