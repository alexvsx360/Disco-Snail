/* Service Worker - Disco Snail Adventure - עבודה אופליין */
const CACHE_NAME = 'disco-snail-v2';

const CORE_FILES = [
  './',
  './index.html',
  './style.css',
  './favicon.png',
  './og-image.png',
  './manifest.json',
  './js/globals.js',
  './js/utils.js',
  './js/classes.js',
  './js/levels.js',
  './js/bosses.js',
  './js/main.js'
];

/* כל קבצי הצליל שהמשחק משתמש בהם */
const SOUND_FILES = [
  './sound/swing.wav',
  './sound/bubble.wav',
  './sound/Hit1.wav',
  './sound/Shoot.wav',
  './sound/Random.wav',
  './sound/coin.wav',
  './sound/Pickup1.wav',
  './sound/magic1.wav',
  './sound/PowerUp.wav',
  './sound/mnstr1.wav',
  './sound/mnstr10.wav',
  './sound/bubble3.wav',
  './sound/slime2.wav',
  './sound/level up sound.mp3',
  './sound/game over music.mp3',
  './sound/enenmy encounter sound.mp3',
  './sound/Boom.wav',
  './sound/door.wav',
  './sound/slime4.wav',
  './sound/spell.wav',
  './Disco Snails _ Vulfmon & Zachary Barker.mp3',
  './sound/slime5.wav',
  './sound/giant1.wav',
  './sound/Boom2.wav',
  './sound/metal-ringing.wav',
  './sound/bubble2.wav'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([...CORE_FILES, ...SOUND_FILES]).catch((err) => {
        console.warn('SW cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request).then((res) => {
        const clone = res.clone();
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => null);
      return cached || fetchPromise;
    })
  );
});
