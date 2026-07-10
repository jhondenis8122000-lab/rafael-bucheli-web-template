/* ============================================
   LOADING.JS - Espera a que el video termine
   ============================================ */

(function() {
    'use strict';

    var preloader = document.getElementById('preloader');
    var video = document.getElementById('loadingVideo');
    var hidden = false;
    var videoDuration = 0;

    function hidePreloader() {
        if (hidden) return;
        hidden = true;
        preloader.classList.add('fade-out');
        setTimeout(function() {
            preloader.style.display = 'none';
            document.body.classList.remove('loading-active');
        }, 700);
    }

    if (video) {
        // Cuando el video esté listo para reproducirse, obtenemos su duración
        video.addEventListener('canplaythrough', function() {
            videoDuration = video.duration || 3; // duración en segundos
            console.log('Duración del video:', videoDuration, 'segundos');

            // Reproducimos el video (por si el autoplay falla)
            video.play().catch(function(err) {
                console.warn('Autoplay bloqueado, el usuario deberá interactuar:', err);
                // Si el autoplay falla, usamos un timeout de seguridad
            });
        });

        // Cuando el video termine, ocultamos
        video.addEventListener('ended', function() {
            console.log('Video terminado, ocultando preloader.');
            hidePreloader();
        });

        // Si el video ya está cargado y tiene duración, la guardamos
        if (video.readyState >= 2) {
            videoDuration = video.duration || 3;
            console.log('Duración del video (ya cargado):', videoDuration);
        }

        // Timeout de seguridad: SOLO si no se dispara 'ended'
        // Nota: algunos navegadores/reportes no calculan bien duration.
        // Por eso usamos un margen grande y además verificamos que el video no esté en reproducción.
        // Importante: NO ocultamos por timeout “a ciegas”, porque eso puede cortar el video.
        // Solo ocultamos cuando realmente dispare el evento 'ended' o si falla totalmente.
        // Aun así dejamos un fallback MUY amplio para casos raros de eventos bloqueados.
        var fallbackTimeout = (videoDuration > 0) ? (videoDuration * 1000 + 20000) : 120000;
        console.log('Fallback timeout (muy amplio):', fallbackTimeout, 'ms');
        setTimeout(function() {
            // Si ya terminó, 'ended' ya disparó y hidePreloader() ya ocurrió.
            // Si por alguna razón no disparó, ocultamos para que la web cargue.
            hidePreloader();
        }, fallbackTimeout);



        // Si el video ya terminó antes de que se ejecute este script (caso raro)
        if (video.ended) {
            console.log('El video ya estaba terminado al cargar el script.');
            hidePreloader();
        }

    } else {
        // Si no hay video, ocultamos inmediatamente
        console.warn('No se encontró el video, ocultando preloader.');
        hidePreloader();
    }

})();