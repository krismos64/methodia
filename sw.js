// Service Worker de remplacement - VIDE
// Ce fichier remplace l'ancien service worker et ne fait rien

console.log('🚫 Service Worker vide - Aucune mise en cache');

// Désactiver complètement la mise en cache
self.addEventListener('install', function(event) {
    console.log('📦 SW vide installé - Pas de cache');
    self.skipWaiting(); // Forcer l'activation immédiate
});

self.addEventListener('activate', function(event) {
    console.log('✅ SW vide activé');
    
    // Supprimer TOUS les anciens caches
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            console.log('🗑️ Suppression de tous les caches:', cacheNames);
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    console.log('❌ Suppression cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(function() {
            console.log('✅ Tous les caches supprimés');
            return self.clients.claim(); // Prendre contrôle immédiat
        })
    );
});

// Ne pas intercepter les requêtes - laisser passer tout
self.addEventListener('fetch', function(event) {
    // Ne rien faire - laisser les requêtes passer normalement au réseau
    console.log('🌐 Requête non interceptée:', event.request.url);
});

// Message de désactivation complète
self.addEventListener('message', function(event) {
    if (event.data && event.data.command === 'SKIP_WAITING') {
        console.log('⚡ Force skipWaiting');
        self.skipWaiting();
    }
});