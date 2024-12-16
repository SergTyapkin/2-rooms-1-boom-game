const SW_FILE_PATH = 'sw.js';
const SCOPE = '.';


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

let SW;

if (navigator.serviceWorker) {
  (async () => {
    try {
      // if (!navigator.serviceWorker.controller) {
        const regPromise = navigator.serviceWorker.register(SW_FILE_PATH, { scope: SCOPE });
        console.log('SW registration...');
        const reg = await regPromise;
        console.log('SW registration success. Scopes: ' + reg.scope);
        reg.onupdatefound = onServiceWorkerUpdated;
        SW = reg.active || reg.waiting || reg.installing;
        await onServiceWorkerStateChangedSW(SW);
      // } else {
      //   console.log('SW has already been installed');
      //   await onServiceWorkerStateChangedSW();
      // }
    } catch(error) {
      console.error('SW installation failed. Error: ' + error);
    }
  })();
}

function onServiceWorkerUpdated(e) {
  const sw = e.target.active || e.target.waiting || e.target.installing;
  sw.onstatechange = onServiceWorkerStateChanged;
  onServiceWorkerStateChangedSW(sw);
}
function onServiceWorkerStateChanged(e = undefined) {
  onServiceWorkerStateChangedSW(e.target);
}
async function onServiceWorkerStateChangedSW(_sw = navigator.serviceWorker.controller) {
  if (!_sw) {
    return;
  }
  SW = _sw;
  await _sw.ready;

  console.log('SW state:', SW.state);
  if (SW.state === 'installed') {
    if (navigator.serviceWorker.controller) {
      console.log('SW has already been installed before');
    } else {
      console.log('SW new instance installed');
    }
  } else if (SW.state === 'activated') {
    SW.postMessage(PostMessage(
      PostMessagesNames.cacheUrls,
      [
        location.href,
        ...performance.getEntriesByType('resource').map(({ name }) => name),
      ]
    ));
  }
}


async function serviceWorkerCacheFiles(urls, callbackEach) {
  if (!SW) {
    console.error('SW: Error. Can\'t cache urls because SW is not initialized yet');
    return;
  }
  await SW.ready;
  console.log('Send to ServiceWorker caching urls...');
  if (SW.state !== 'activated') {
    console.error('SW: Error. Can\'t cache urls because SW is not activated yet. SW state:', SW.state);
    return;
  }
  let resolvePromise, rejectPromise;
  const promise = new Promise((resolve, reject) => {resolvePromise = resolve; rejectPromise = reject});
  navigator.serviceWorker.onmessage = (e) => {
    console.log('MESSAGE', e)
    if (e.data.type === PostMessagesNames.swCacheProgress) {
      callbackEach({
        current: e.data.payload.current,
        progress: e.data.payload.progress,
        total: e.data.payload.total,
      });
    } else if (e.data.type === PostMessagesNames.swAllUrlsCached) {
      resolvePromise();
    }
  };

  SW.postMessage(PostMessage(PostMessagesNames.cacheUrls, urls));
  return promise;
}

window.serviceWorkerCacheFiles = serviceWorkerCacheFiles;
export {serviceWorkerCacheFiles};
