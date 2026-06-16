/**
 * FITOPIA Service Worker Registration client script
 * Bootstraps the application offline capabilities and caches safely,
 * avoiding security error blocks in sandboxed development iframe environments.
 */

(() => {
  let isInsideIframe = false;
  try {
    isInsideIframe = window.self !== window.top;
  } catch (e) {
    isInsideIframe = true;
  }

  if (isInsideIframe) {
    console.warn('FITOPIA PWA: Service Worker registration bypassed inside sandboxed dev iframe to prevent security exceptions. Opens & installs perfectly in a separate tab!');
    return;
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('FITOPIA Service Worker registered successfully with scope:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('New content is available; please refresh.');
                  } else {
                    console.log('Content is cached for offline use.');
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          // Gracefully log instead of breaking the app for harmless security/blocked errors
          console.warn('FITOPIA Service Worker registration bypassed or blocked by browser policies (e.g., iframe sandboxing or private mode):', error.message || error);
        });
    });
  }
})();
