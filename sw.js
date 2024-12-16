// наименование для нашего хранилища кэша
const CACHE_KEYNAME = 'app_serviceworker_v_1';

// regExp-ссылок на НЕ-кэшируемые файлы
const DISABLE_CACHING_URLS_REGEXPS = [
  /sw\.js/,
];

// для страниц слева будут отдаваться ресурсы справа
const RESOURCE_MAPPING_REGEXPS = {
  'role\\.html\\?idx=\\d+': 'role.html',
};

// Типы PostMessage для общения приложения с service worker'ом
const PostMessagesNames = {
  cacheUrls: 'CACHE_URLS',

  swCacheProgress: 'SW_CACHE_PROGRESS',
  swAllUrlsCached: 'SW_ALL_URLS_CACHED',
}


const PostMessage = (type, payload) => ({
  type: type,
  payload: payload,
});


function broadcastPostMessage(message) {
  // Select who we want to respond to
  self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clients) => {
    if (clients && clients.length) {
      // Send a response - the clients
      // array is ordered by last focused
      clients[0].postMessage(message);
    }
  });
}

console.log('SW file initialized');

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
  console.log('SW installed', event);
});
self.addEventListener('active', function(event) {
  console.log('SW active', event);
});

function isUrlNotCachable(url) {
  return DISABLE_CACHING_URLS_REGEXPS.some(regExp => regExp.test(url));
}
async function downloadAll(urls, callbackEach) {
  const cache = await caches.open(CACHE_KEYNAME);
  const promises = [];
  let finishedCount = 0;
  urls.forEach(url => {
    if (isUrlNotCachable(url)) {
      return;
    }
    try {
      promises.push(cache.add(url).then(() => {
        finishedCount++;
        callbackEach({current: url, progress: finishedCount});
      }));
    } catch (err) {
      console.warn('SW: Error on caching file', url, '| Error:', err);
    }
  });
  await Promise.all(promises);
}
async function setCached(url, response) {
  if (isUrlNotCachable(url)) {
    return;
  }
  const cache = await caches.open(CACHE_KEYNAME);
  await cache.put(url, response.clone());
}

// Добавление в кэш статики через postMessage, отправленной из основного приложения
self.addEventListener('message', async (event) => {
  if (event.data.type === PostMessagesNames.cacheUrls) {
    if (!event.data.payload || !Array.isArray(event.data.payload)) {
      console.error('SW: Incorrect PostMessage with caching urls');
      return;
    }
    await downloadAll(event.data.payload, (data) => {
      broadcastPostMessage(PostMessage(PostMessagesNames.swCacheProgress, {
        current: data.current,
        progress: data.progress,
        total: event.data.payload.length,
      }));
      console.log('SW:', data.progress, data.current);
    });
    broadcastPostMessage(PostMessage(PostMessagesNames.swAllUrlsCached, null));
    console.log('SW: Urls added to cache:', event.data.payload);
  }
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      try { // Пытаемся отправить оригинальный запрос
        const response = await fetch(event.request);
        if (response.ok) { // Запрос прошел. Отдаем оригинальный запрос
          // Добавляем в кэш
          await setCached(event.request, response);
          // Возвращаем
          return response;
        }
        throw Error('Start respond with cache...'); // Запрос не прошел. Отдаем из кэша
      } catch { // Оригинальный запрос упал. Пытаемся отдать из кэша
        // Преобразуем url по правилам из конфига в константах
        let url = event.request.url;
        const replacingRegExp = Object.keys(RESOURCE_MAPPING_REGEXPS).find(regExpStr => (new RegExp(regExpStr, 'ig')).test(url));
        if (replacingRegExp) {
          url = url.replaceAll(new RegExp(replacingRegExp, 'ig'), RESOURCE_MAPPING_REGEXPS[replacingRegExp]);
        }
        // Ищем кэш
        const cachedResponse = await caches.match(url);
        // Отдаем либо кэш, либо ответ 418
        return cachedResponse || new Response(`
<html lang="en">
<head>
  <title>You're offline</title>
  <meta charset="UTF-8"/>
</head>
<body align="center"">
  <h1>Нет соединения</h1>
  <p>
    <b>Чтобы згрузить эту страницу, включите соединение</b>
    <br>
    <small><i>Или этой страницы не существует</i></small>
  </p>
</body>
</html>`, {headers: { 'Content-Type': 'text/html' }});
      }
    })()
  );
});
