// Register the service worker if available.
const worker = new Worker("sw.js")
self.addEventListener('message', function(e) {
    self.postMessage(e.data);
  }, false);
