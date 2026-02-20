/* ===========================================
   LOADING.JS - Versión simplificada
   =========================================== */

(function() {
    'use strict';

    // Esperar a que el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        
        // Ocultar preloader cuando la página esté completamente cargada
        window.addEventListener('load', function() {
            hidePreloader();
        });
        
        // Timeout de seguridad (3 segundos máximo)
        setTimeout(function() {
            hidePreloader();
        }, 3000);
        
        function hidePreloader() {
            var preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('fade-out');
                setTimeout(function() {
                    preloader.style.display = 'none';
                    document.body.classList.remove('loading-active');
                }, 500);
            }
        }
        
        // Si ya está cargado, ocultar inmediatamente
        if (document.readyState === 'complete') {
            hidePreloader();
        }
    });

})();