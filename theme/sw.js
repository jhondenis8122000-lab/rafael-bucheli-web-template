self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
});

self.addEventListener('push', function(event) {
  const options = {
    body: '¡Bienvenido a Unidad Educativa Rafael Bucheli!',
    icon: 'assets/images/icon/logo.png',
    badge: 'assets/images/icon/logo.png'
  };
  event.waitUntil(
    self.registration.showNotification('Rafael Bucheli', options)
  );
});
