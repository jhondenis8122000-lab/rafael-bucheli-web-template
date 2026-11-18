/* ============================================
   loading-video.js - Preloader con vídeo (home)
   ============================================ */
(function () {
    'use strict';

    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    var video = document.getElementById('loadingVideo');
    var oculto = false;
    var inicio = Date.now();

    function ocultar() {
        if (oculto) return;
        oculto = true;

        var restante = Math.max(0, 350 - (Date.now() - inicio));
        setTimeout(function () {
            preloader.classList.add('hidden');
            document.dispatchEvent(new CustomEvent('rb:loaded'));
            setTimeout(function () {
                preloader.style.display = 'none';
            }, 500);
        }, restante);
    }

    if (!video) {
        setTimeout(ocultar, 600);
        return;
    }

    function reproducir() {
        var promesa = video.play();
        if (promesa && promesa.catch) promesa.catch(ocultar);
    }

    video.addEventListener('loadeddata', reproducir);
    video.addEventListener('canplay', reproducir);
    video.addEventListener('ended', ocultar);
    video.addEventListener('error', ocultar);

    Array.prototype.forEach.call(video.querySelectorAll('source'), function (source) {
        source.addEventListener('error', function () {
            if (video.networkState === 3) ocultar();
        });
    });

    if (video.readyState >= 3) reproducir();
    if (video.ended) ocultar();

    setTimeout(ocultar, 4500);
})();
