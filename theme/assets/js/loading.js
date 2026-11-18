/* ============================================
   loading.js - Oculta el preloader sin vídeo
   ============================================ */
(function () {
    'use strict';

    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    var oculto = false;
    var inicio = Date.now();
    var MINIMO = 350;

    function ocultar() {
        if (oculto) return;
        oculto = true;

        var espera = Math.max(0, MINIMO - (Date.now() - inicio));
        setTimeout(function () {
            preloader.classList.add('hidden');
            document.dispatchEvent(new CustomEvent('rb:loaded'));
            setTimeout(function () {
                preloader.style.display = 'none';
            }, 500);
        }, espera);
    }

    if (document.readyState === 'complete') {
        ocultar();
    } else {
        window.addEventListener('load', ocultar, { once: true });
    }

    setTimeout(ocultar, 2500);
})();
