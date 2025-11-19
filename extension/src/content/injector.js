// src/content/injector.js
// injector.js - content script: inject extension scripts into the page context
(function () {
  // Prevent duplicate injection on SPA navigation
  if (window.__MY_EXT_INJECTED__) return;
  window.__MY_EXT_INJECTED__ = true;

  function injectScript(fileName) {
    try {
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.src = chrome.runtime.getURL(fileName);
      script.onload = function () {
        // Script loaded successfully
      };
      (document.head || document.documentElement).appendChild(script);
    } catch (err) {
      console.error('Injection error for', fileName, err);
    }
  }

  // Inject the bundled file
  injectScript('dist/bundle.js');
})();