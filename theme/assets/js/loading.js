/* loading.js - Versión ultra rápida */
(function() {
    'use strict';
    
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Función para ocultar el preloader
    const hidePreloader = () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.remove('loading-active');
        }, 300);
    };

    // Ocultar cuando la página esté completamente cargada
    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
        // Timeout de seguridad por si algo falla
        setTimeout(hidePreloader, 2000);
    }
})();