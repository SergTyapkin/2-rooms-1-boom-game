// наименование для нашего хранилища кэша
const CACHE_KEYNAME = 'app_serviceworker_v_1';

// Стратегия кэширования.
// true - сначала отдавать из кэша, а потом по возможности обновлять ресурс.
// false - сначала ждать ответа на запрос, а потом отдавать из кэша, если запрос не прошел
const STRATEGY_CACHE_FIRST = false;

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
  isUrlsCached: 'IS_URLS_CACHED',
  clearCache: 'CLEAR_CACHE',

  swCacheProgress: 'SW_CACHE_PROGRESS',
  swAllUrlsCached: 'SW_ALL_URLS_CACHED',
  swUrlsCachingError: 'SW_URLS_CACHING_ERROR',
  swIsUrlsCachedResponse: 'SW_IS_URLS_CACHED',
  swCacheCleared: 'SW_CACHE_CLEARED',
}

const PostMessage = (type, payload, uid) => ({
  type: type,
  payload: payload,
  uid: uid,
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

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
  console.log('SW installed', event);
});
self.addEventListener('active', function (event) {
  console.log('SW active', event);
});

function isUrlNotCachable(url) {
  return DISABLE_CACHING_URLS_REGEXPS.some(regExp => regExp.test(url));
}

function rewriteUrlToCachedUrl(url) {
  // apply rewriting rules
  const replacingRegExp = Object.keys(RESOURCE_MAPPING_REGEXPS).find(regExpStr => (new RegExp(regExpStr, 'ig')).test(url));
  if (replacingRegExp) {
    url = url.replaceAll(new RegExp(replacingRegExp, 'ig'), RESOURCE_MAPPING_REGEXPS[replacingRegExp]);
  }
  // relative url to absolute
  if (!(url.startsWith('/') || url.startsWith('http'))) {
    url = location.protocol + '//' + location.host + location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1) + url;
  }
  return url;
}
async function setCached(url, response, openedCache=undefined) {
  if (isUrlNotCachable(url)) {
    return;
  }
  const cache = openedCache || await caches.open(CACHE_KEYNAME);
  await cache.put(url, response.clone());
}
async function downloadAll(urls, callbackEach, openedCache=undefined) {
  const cache = openedCache || await caches.open(CACHE_KEYNAME);
  const promises = [];
  let finishedCount = 0;
  let errorUrl = null;
  urls.forEach(url => {
    if (isUrlNotCachable(url)) {
      return;
    }
    promises.push(fetch(url)
      .then(async (response) => {
        await setCached(url, response.clone(), cache);
        finishedCount++;
        callbackEach({current: url, progress: finishedCount});
      })
      .catch((err) => {
        errorUrl = url;
        console.warn('SW: Error on caching file', url, '| Error:', err);
      })
    );
  });
  await Promise.all(promises);
  return errorUrl;
}

self.addEventListener('message', async (event) => {
  if (event.data.type === PostMessagesNames.cacheUrls) {
    // Добавление в кэш статики через postMessage, отправленной из основного приложения
    if (!event.data.payload || !Array.isArray(event.data.payload)) {
      console.error('SW: Incorrect PostMessage with caching urls');
      return;
    }
    const errorUrl = await downloadAll(event.data.payload, (data) => {
      broadcastPostMessage(PostMessage(
        PostMessagesNames.swCacheProgress,
        {
          current: data.current,
          progress: data.progress,
          total: event.data.payload.length,
        },
        event.data.uid,
      ));
    });
    if (errorUrl === null) {
      broadcastPostMessage(PostMessage(PostMessagesNames.swAllUrlsCached, null, event.data.uid));
      console.log('SW: Urls added to cache:', event.data.payload);
    } else {
      broadcastPostMessage(PostMessage(PostMessagesNames.swUrlsCachingError, errorUrl, event.data.uid));
      console.error('SW: Urls added to cache with error in:', errorUrl, ' | All urls: ', event.data.payload);
    }

  } else if (event.data.type === PostMessagesNames.isUrlsCached) {
    // Проверка, добавлена ли в кэш статика через postMessage, отправленной из основного приложения
    const cache = await caches.open(CACHE_KEYNAME);
    const allCachedUrls = await cache.keys();
    const urls = event.data.payload;
    broadcastPostMessage(PostMessage(
      PostMessagesNames.swIsUrlsCachedResponse,
      urls.every(url => {
        const cachedUrl = rewriteUrlToCachedUrl(url);
        return allCachedUrls.some(cachedReq => cachedReq.url === cachedUrl);
      }),
      event.data.uid,
    ));

  } else if (event.data.type === PostMessagesNames.clearCache) {
    // Очистка кэша
    const cache = await caches.open(CACHE_KEYNAME);
    const promises = (await cache.keys()).map(key => cache.delete(key));
    await Promise.all(promises);
    broadcastPostMessage(PostMessage(
      PostMessagesNames.swCacheCleared,
      null,
      event.data.uid,
    ));
  }
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  const getResponseWithFetch = async () => {
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        await setCached(event.request, response); // Добавляем в кэш
        return response;
      }
      return null;
    } catch {
      return null;
    }
  };
  const getResponseFromCache = async () => {
    // Преобразуем url по правилам из конфига в константах
    const url = rewriteUrlToCachedUrl(event.request.url);
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
</html>`, {headers: {'Content-Type': 'text/html'}});
  };

  event.respondWith(
    (async () => {
      if (STRATEGY_CACHE_FIRST) {
        const result = await getResponseFromCache();
        getResponseWithFetch();
        return result;
      }
      return (await getResponseWithFetch()) ||
             (await getResponseFromCache());
    })()
  );
});
