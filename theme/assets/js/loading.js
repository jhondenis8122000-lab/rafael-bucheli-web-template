/* ===========================================
   LOADING.JS - Minimalista y eficiente
   =========================================== */

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        minLoadingTime: 2500,        // Mínimo 2.5 segundos
        maxLoadingTime: 8000,        // Máximo 8 segundos
        showSkipAfter: 2000          // Mostrar skip después de 2s
    };

    // Elementos
    let elements = {};
    let startTime = Date.now();
    let minTimeElapsed = false;
    let videoReady = false;
    let contentLoaded = false;

    // Inicialización
    function init() {
        // Bloquear scroll
        document.body.classList.add('loading-active');
        
        // Obtener elementos
        elements = {
            preloader: document.getElementById('preloader'),
            video: document.getElementById('loadingVideo'),
            logoCenter: document.querySelector('.logo-center'),
            skipButton: document.querySelector('.skip-button'),
            skipBtn: document.getElementById('skipLoading')
        };

        // Verificar elementos críticos
        if (!elements.preloader) {
            completeLoading();
            return;
        }

        // Configurar timers
        startTimers();

        // Configurar video
        setupVideo();

        // Configurar skip
        setupSkipButton();

        // Escuchar carga de página
        if (document.readyState === 'complete') {
            contentLoaded = true;
        } else {
            window.addEventListener('load', () => {
                contentLoaded = true;
                checkCompletion();
            });
        }
    }

    // Configurar video
    function setupVideo() {
        if (!elements.video) {
            videoReady = true;
            checkCompletion();
            return;
        }

        // Intentar reproducir automáticamente
        const playPromise = elements.video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    videoReady = true;
                    console.log('✅ Video reproduciéndose');
                })
                .catch(error => {
                    console.log('ℹ️ Autoplay no permitido, usando muted');
                    // Intentar con muted
                    elements.video.muted = true;
                    elements.video.play()
                        .then(() => {
                            videoReady = true;
                        })
                        .catch(() => {
                            videoReady = true; // Continuar aunque no se pueda reproducir
                        });
                });
        }

        // Cuando el video termine
        elements.video.addEventListener('ended', () => {
            videoReady = true;
            checkCompletion();
        });

        // En caso de error
        elements.video.addEventListener('error', () => {
            videoReady = true;
            checkCompletion();
        });

        // Timeout para video
        setTimeout(() => {
            if (!videoReady) {
                videoReady = true;
                checkCompletion();
            }
        }, 5000);
    }

    // Timers
    function startTimers() {
        // Tiempo mínimo
        setTimeout(() => {
            minTimeElapsed = true;
            checkCompletion();
        }, CONFIG.minLoadingTime);

        // Mostrar botón skip
        setTimeout(() => {
            if (elements.skipButton) {
                elements.skipButton.classList.add('visible');
            }
        }, CONFIG.showSkipAfter);

        // Timeout máximo de seguridad
        setTimeout(() => {
            completeLoading();
        }, CONFIG.maxLoadingTime);
    }

    // Configurar botón skip
    function setupSkipButton() {
        if (elements.skipBtn) {
            elements.skipBtn.addEventListener('click', completeLoading);
        }
    }

    // Verificar si se puede completar
    function checkCompletion() {
        if (minTimeElapsed && videoReady && contentLoaded) {
            completeLoading();
        }
    }

    // Completar loading
    function completeLoading() {
        // Aplicar fade out
        if (elements.preloader) {
            elements.preloader.classList.add('fade-out');
        }

        // Esperar transición y ocultar
        setTimeout(() => {
            if (elements.preloader) {
                elements.preloader.style.display = 'none';
            }
            
            // Desbloquear body
            document.body.classList.remove('loading-active');
            
            // Emitir evento
            document.dispatchEvent(new CustomEvent('loadingCompletado', {
                detail: { duration: Date.now() - startTime }
            }));
            
            console.log('✅ Loading completado en ' + (Date.now() - startTime) + 'ms');
        }, 600);
    }

    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100); // Pequeño delay para asegurar
    }

})();