// public/sw.js

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated!');
});

// Required to mark it as a PWA: handle fetch
self.addEventListener('fetch', (event) => {
  // You can customize this for caching if needed
  // This minimal version just lets Chrome know it's a valid SW
});
