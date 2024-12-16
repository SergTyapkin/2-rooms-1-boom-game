// период обновления кэша - одни сутки
const MAX_AGE = 86400000;

// наименование для нашего хранилища кэша
const CACHE_KEYNAME = 'app_serviceworker_v_1';

// regExp-ссылок на НЕ-кэшируемые файлы
const DISABLE_CACHING_URLS_REGEXPS = [
];

console.log('SW file initialized');

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
  console.log('SW installed', event);
});
self.addEventListener('active', function(event) {
  console.log('SW active', event);
});

// Добавление в кэш статики через postMessage, отправленной из основного приложения
self.addEventListener('message', async (event) => {
  if (event.data.type === 'CACHE_URLS') {
    if (!event.data.payload || !Array.isArray(event.data.payload)) {
      console.error('SW: Incorrect PostMessage with caching urls');
      return;
    }
    try {
      const cache = await caches.open(CACHE_KEYNAME);
      await cache.addAll(event.data.payload);
      console.log('SW: Urls added to cache:', event.data.payload);
    } catch (error) {
      console.error('SW: Adding urls to cache error:', error);
    }
  }
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      console.log("FETCH EVENT", event);
      try { // Пытаемся отправить оригинальный запрос
        const response = await fetch(event.request);
        if (response.ok) { // Запрос прошел. Отдаем оригинальный запрос
          // Добавляем в кэш
          const cache = await caches.open(CACHE_KEYNAME);
          await cache.put(event.request, response.clone());
          // Возвращаем
          return response;
        }
        throw Error('Start respond with cache...'); // Запрос не прошел. Отдаем из кэша
      } catch { // Оригинальный запрос упал. Пытаемся отдать из кэша
        const cachedResponse = await caches.match(event.request);
        // Отдаем либо кэш, либо ответ 418
        return cachedResponse || new Response(`
<html lang="en">
<head>
  <title>You're offline</title>
  <meta charset="UTF-8"/>
</head>
<body align="center"">
  <h1>Нет соединения</h1>
  <h4>Чтобы згрузить эту страницу, включите соединение</h4>
</body>
</html>`, {headers: { 'Content-Type': 'text/html' }});
      }
    })()
  );
});
