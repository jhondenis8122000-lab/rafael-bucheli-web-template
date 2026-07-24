/* ============================================
   LOADING.JS - Super robusto, oculta el preloader
   siempre, incluso si hay errores previos
   ============================================ */

(function() {
    'use strict';

    var preloader = document.getElementById('preloader');
    if (!preloader) {
        console.warn('loading.js: #preloader no encontrado');
        return;
    }

    var hidden = false;
    var video = document.getElementById('loadingVideo');
    var videoLoaded = false;

    function hidePreloader() {
        if (hidden) return;
        hidden = true;

        // Agregar clase hidden para la transición CSS
        preloader.classList.add('hidden');

        // Forzar opacidad para asegurar que se oculta
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';

        // Después de la transición (600ms), ocultar completamente del DOM
        setTimeout(function() {
            preloader.style.display = 'none';
            preloader.style.visibility = 'hidden';
            document.body.classList.remove('loading-active');
        }, 700);
    }

    function tryPlayVideo() {
        if (!video || hidden) return;
        var playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(function() {
                // Autoplay bloqueado - ocultar preloader
                hidePreloader();
            });
        }
    }

    if (video) {
        // El video se cargó parcialmente
        video.addEventListener('loadeddata', function() {
            videoLoaded = true;
            tryPlayVideo();
        });

        // El video puede reproducirse sin buffering
        video.addEventListener('canplay', function() {
            tryPlayVideo();
        });

        // El video se cargó completamente y listo
        video.addEventListener('canplaythrough', function() {
            videoLoaded = true;
            tryPlayVideo();
        });

        // El video empezó a reproducirse
        video.addEventListener('playing', function() {
            // Video reproduciéndose correctamente
        });

        // El video terminó - ocultar preloader
        video.addEventListener('ended', function() {
            hidePreloader();
        });

        // Error en el video
        video.addEventListener('error', function() {
            hidePreloader();
        });

        // Error en las fuentes individuales
        var sources = video.querySelectorAll('source');
        sources.forEach(function(src) {
            src.addEventListener('error', function() {
                // Si todas las fuentes fallaron, ocultar
                if (video.networkState === 3) {
                    hidePreloader();
                }
            });
        });

        // Si el video ya se cargó antes de que el JS se ejecutara
        if (video.readyState >= 3) {
            videoLoaded = true;
            tryPlayVideo();
        }

        // Si el video ya terminó
        if (video.ended) {
            hidePreloader();
        }

        // Fallback: Ocultar después de 5 segundos si el video no ha terminado
        setTimeout(function() {
            if (!hidden) {
                hidePreloader();
            }
        }, 5000);

    } else {
        // No hay video - ocultar con un breve delay para mostrar logo/spinner
        setTimeout(hidePreloader, 1500);
    }

    // Fallback ULTRA absoluto: ocultar a los 4 segundos pase lo que pase
    setTimeout(function() {
        if (!hidden) {
            preloader.style.display = 'none';
            preloader.style.visibility = 'hidden';
            preloader.style.opacity = '0';
            hidden = true;
        }
    }, 4000);

    // Si la página ya está completamente cargada, ocultar más rápido
    if (document.readyState === 'complete') {
        setTimeout(hidePreloader, 500);
    } else {
        window.addEventListener('load', function() {
            // Cuando la página carga completamente, dar tiempo al video para terminar
            // pero no más de 3 segundos adicionales
            setTimeout(function() {
                if (!hidden) {
                    hidePreloader();
                }
            }, 2000);
        });
    }

})();
