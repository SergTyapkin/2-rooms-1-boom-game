const SW_FILE_PATH = 'sw.js';
const SCOPE = '.';

if ('serviceWorker' in navigator) {
  (async () => {
    try {
      const reg = await navigator.serviceWorker.register(SW_FILE_PATH, { scope: SCOPE });
      console.log('SW registration success. Scope: ' + reg.scope);
      const data = {
        type: 'CACHE_URLS',
        payload: [
          location.href,
          ...performance.getEntriesByType('resource').map(({ name }) => name)
        ]
      };
      const { installing, waiting, active } = reg;
      if (installing) {
        console.log('SW installing...');
      } else if (waiting) {
        console.log('SW installed');
      } else if (active) {
        active.postMessage(data);
        console.log('Send to ServiceWorker caching urls...');
      }
    } catch(error) {
      console.log('SW installation failed. Error: ' + error);
    }
  })();
}
navigator.serviceWorker.register(
  'assets/scripts/sw.js'
).then(function(registration) {
  console.log('ServiceWorker registration', registration);
  // строкой ниже можно прекратить работу serviceWorker’а
  //registration.unregister();
}).catch(function(err) {
  throw new Error('ServiceWorker registration error: ' + err);
});
