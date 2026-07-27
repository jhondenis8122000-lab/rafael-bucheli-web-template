self.addEventListener('install', function(event) {
});

self.addEventListener('activate', function(event) {
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
