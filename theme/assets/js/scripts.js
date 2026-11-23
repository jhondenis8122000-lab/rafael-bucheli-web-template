/*============================
   scripts.js - Comportamiento del sitio
   ============================*/

(function($) {
    "use strict";

    $(document).ready(function() {
        initHeaderEffects();
        initDock();
        initSmoothScroll();
        initCounters();
        initCarousels();
        initHeroMotion();
        initScrollMotion();
        initScrollFX();
        initRevealFX();
    });

    /*================================
     1. HEADER EFFECTS
     ==================================*/
    function initHeaderEffects() {
        $(window).on('scroll', function() {
            $('.header-two').toggleClass('scrolled', $(window).scrollTop() > 50);
        });
    }

    /*================================
     1b. DOCK FLOTANTE: baja y sube
     ==================================*/
    function initDock() {
        var $dock = $('.header-two .container-fluid > .row');
        if (!$dock.length || !window.matchMedia) return;

        var desktop = window.matchMedia('(min-width: 992px)');
        var ultimo = window.pageYOffset;
        var ticking = false;
        var pausado = false;

        function mostrar() {
            $dock.removeClass('dock-oculto').addClass('dock-visible').attr('aria-hidden', 'false');
        }

        function aplicar() {
            ticking = false;
            var actual = window.pageYOffset;
            if (desktop.matches && !pausado && actual > 220 && actual > ultimo + 4) {
                $dock.addClass('dock-oculto').removeClass('dock-visible').attr('aria-hidden', 'true');
            } else if (actual < 120 || actual < ultimo - 4 || pausado) {
                mostrar();
            }
            ultimo = actual;
        }

        $(window).on('scroll', function() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(aplicar);
        });

        $dock.on('mouseenter focusin', function() {
            pausado = true;
            mostrar();
        }).on('mouseleave focusout', function() {
            pausado = false;
        });

        if (desktop.addEventListener) {
            desktop.addEventListener('change', function() {
                mostrar();
                ultimo = window.pageYOffset;
            });
        }

        mostrar();
    }

    /*================================
     2. SCROLL SUAVE PARA ANCLAS
     ==================================*/
    function initSmoothScroll() {
        $(document).on('click', 'a[href^="#"]', function(event) {
            var target = document.getElementById(this.hash.slice(1));
            if (target && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: $(target).offset().top - 50
                }, 1000);
            }
        });
    }

    /*================================
     3. CONTADORES ANIMADOS
     ==================================*/
    function initCounters() {
        if (!document.querySelectorAll || !('IntersectionObserver' in window)) {
            $('.counter').each(function() {
                $(this).text($(this).data('target'));
            });
            return;
        }

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);

                var el = entry.target;
                var target = parseInt(el.getAttribute('data-target'), 10) || 0;
                var inicio = Date.now();
                var duracion = 1600;
                var sufijo = target > 100 ? '+' : '';

                function actualizar() {
                    var progreso = Math.min((Date.now() - inicio) / duracion, 1);
                    var valor = Math.floor((1 - Math.pow(1 - progreso, 3)) * target);
                    el.textContent = (progreso < 1 ? valor : target).toLocaleString('es-EC') + sufijo;
                    if (progreso < 1) requestAnimationFrame(actualizar);
                }
                actualizar();
            });
        }, { threshold: 0.4 });

        document.querySelectorAll('.counter').forEach(function(el) {
            observer.observe(el);
        });
    }

    /*================================
     4. CARRUSELES
     ==================================*/
    function initCarousels() {
        if (!$.fn.owlCarousel) return;
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if ($('#heroSlider').length) {
            $('#heroSlider').owlCarousel({
                loop: true,
                items: 1,
                nav: false,
                dots: true,
                autoplay: !reducedMotion,
                autoplayTimeout: 5500,
                autoplayHoverPause: true,
                smartSpeed: 800,
                animateOut: 'fadeOut',
                animateIn: 'fadeIn'
            });
        }

        if ($('.fullscreen-carousel').length) {
            $('.fullscreen-carousel').owlCarousel({
                loop: true,
                items: 1,
                nav: true,
                dots: true,
                autoplay: !reducedMotion,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                animateOut: 'fadeOut',
                animateIn: 'fadeIn',
                smartSpeed: 800,
                navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
            });
        }

        if ($('.commn-carousel').length) {
            $('.commn-carousel').owlCarousel({
                loop: true,
                autoplay: false,
                dots: true,
                nav: false,
                smartSpeed: 800,
                responsive: {
                    0: { items: 1 },
                    480: { items: 1 },
                    768: { items: 2 },
                    1024: { items: 3 }
                }
            });
        }

        if ($('.tst-carousel').length) {
            $('.tst-carousel').owlCarousel({
                loop: true,
                autoplay: false,
                dots: true,
                items: 1,
                nav: false,
                smartSpeed: 800
            });
        }
    }

    /*================================
     4b. PROGRESO DEL HERO
     ==================================*/
    function initHeroMotion() {
        var $slider = $('#heroSlider');
        var $progress = $('.hero-progress');
        if (!$slider.length || !$progress.length) return;

        function reiniciar() {
            $progress.removeClass('activo');
            void $progress[0].offsetWidth;
            $progress.addClass('activo');
        }

        $slider.addClass('hero-motion-on');
        reiniciar();
        $slider.on('changed.owl.carousel', reiniciar);
    }

    /*================================
     4c. PROGRESO DE LECTURA (fallback)
     ==================================*/
    function initScrollMotion() {
        var bar = document.querySelector('.scroll-progress span');
        if (!bar || (window.CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll()'))) return;

        var ticking = false;
        function actualizar() {
            var maximo = document.documentElement.scrollHeight - window.innerHeight;
            var avance = maximo > 0 ? window.pageYOffset / maximo : 0;
            bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, avance)) + ')';
            ticking = false;
        }
        window.addEventListener('scroll', function() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(actualizar);
        }, { passive: true });
        actualizar();
    }

    /*================================
     4d. PARALLAX Y EFECTOS DE SCROLL
     ==================================*/
    function initScrollFX() {
        if (!window.requestAnimationFrame || !window.matchMedia) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var hero = document.querySelector('.hero-slider');
        var fullscreen = document.querySelector('.fullscreen-carousel-area');
        var acreditados = document.querySelector('.acreditados-fullscreen');
        var acreditadosBg = acreditados ? acreditados.querySelector('.acreditados-bg') : null;
        var valueSection = document.querySelector('.value-proposal-section');
        var valueGrid = valueSection ? valueSection.querySelector('.value-image-grid') : null;
        var ticker = document.querySelector('.hero-ticker-track');
        var tickerBox = document.querySelector('.hero-ticker');

        var vh = window.innerHeight;
        var heroH = hero ? hero.offsetHeight : 0;
        var vTop = 0, vH = 0, fTop = 0, fH = 0, aTop = 0, aH = 0;
        var ticking = false;

        function clamp(valor) {
            return valor < 0 ? 0 : valor > 1 ? 1 : valor;
        }

        function medir(el) {
            if (!el) return null;
            var r = el.getBoundingClientRect();
            return { top: r.top + window.pageYOffset, height: r.height };
        }

        function avance(seccion, y) {
            return clamp((y + vh - seccion.top) / (vh + seccion.height));
        }

        function medirSecciones() {
            vh = window.innerHeight;
            heroH = hero ? hero.offsetHeight : 0;
            var v = medir(valueSection);
            var f = medir(fullscreen);
            var a = medir(acreditados);
            if (v) { vTop = v.top; vH = v.height; }
            if (f) { fTop = f.top; fH = f.height; }
            if (a) { aTop = a.top; aH = a.height; }
        }

        function actualizar() {
            ticking = false;
            var y = window.pageYOffset;

            if (hero) {
                var hp = clamp(y / Math.max(heroH, 1));
                hero.style.setProperty('--hero-bg-y', (hp * 64).toFixed(2) + 'px');
            }
            if (fullscreen) {
                var fp = avance({ top: fTop, height: fH }, y);
                fullscreen.style.setProperty('--fs-bg-y', ((0.5 - fp) * 90).toFixed(2) + 'px');
                fullscreen.style.setProperty('--fs-content-y', ((0.5 - fp) * 30).toFixed(2) + 'px');
            }
            if (acreditadosBg) {
                var ap = avance({ top: aTop, height: aH }, y);
                acreditadosBg.style.transform = 'translate3d(0, ' + ((0.5 - ap) * 80).toFixed(2) + 'px, 0) scale(1.1)';
            }
            if (valueGrid) {
                var vp = avance({ top: vTop, height: vH }, y);
                valueGrid.style.transform = 'translate3d(0, ' + ((0.5 - vp) * 46).toFixed(2) + 'px, 0)';
            }
        }

        function alScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(actualizar);
        }

        medirSecciones();
        actualizar();
        window.addEventListener('scroll', alScroll, { passive: true });
        window.addEventListener('resize', function() {
            medirSecciones();
            alScroll();
        }, { passive: true });
        window.addEventListener('load', function() {
            medirSecciones();
            alScroll();
        });
        if ('ResizeObserver' in window) {
            new ResizeObserver(function() {
                medirSecciones();
                alScroll();
            }).observe(document.body);
        }

        if (ticker && tickerBox && 'IntersectionObserver' in window) {
            document.documentElement.classList.add('fx-ticker');

            var mitad = 0;
            var recorrido = 0;
            var ultimo = 0;
            var visible = false;
            var rafId = 0;

            function medirCinta() {
                var hijos = ticker.children;
                if (hijos && hijos.length > 2) {
                    mitad = Math.round(hijos[hijos.length / 2].offsetLeft - hijos[0].offsetLeft);
                }
                if (!mitad) mitad = ticker.scrollWidth / 2;
            }

            function frame(ts) {
                if (!visible) {
                    rafId = 0;
                    return;
                }
                if (!ultimo) ultimo = ts;
                var dt = Math.min(48, ts - ultimo);
                ultimo = ts;
                recorrido += dt * 0.028;
                if (mitad > 0) {
                    var offset = (window.pageYOffset * 0.55 + recorrido) % mitad;
                    if (offset < 0) offset += mitad;
                    ticker.style.transform = 'translate3d(-' + offset.toFixed(2) + 'px, 0, 0)';
                }
                rafId = requestAnimationFrame(frame);
            }

            medirCinta();
            window.addEventListener('load', medirCinta);
            window.addEventListener('resize', medirCinta, { passive: true });
            if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
                document.fonts.ready.then(medirCinta);
            }

            new IntersectionObserver(function(entries) {
                visible = entries[0].isIntersecting;
                if (visible) {
                    ultimo = 0;
                    if (!rafId) rafId = requestAnimationFrame(frame);
                }
            }, { rootMargin: '120px 0px' }).observe(tickerBox);
        }
    }

    /*================================
     5. REVEALS COREOGRAFIADOS
     ==================================*/
    function initRevealFX() {
        if (!window.IntersectionObserver || !document.querySelector) return;
        if (!document.querySelector('[data-fx]')) return;
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var grupos = [];

        function perteneceAlGrupo(el, grupo) {
            var padre = el.parentElement;
            while (padre && padre !== grupo) {
                if (padre.hasAttribute('data-fx-group')) return false;
                padre = padre.parentElement;
            }
            return padre === grupo;
        }

        document.querySelectorAll('[data-fx-group]').forEach(function(grupo) {
            var paso = parseInt(grupo.getAttribute('data-fx-step'), 10);
            if (isNaN(paso) || paso < 0) paso = 90;

            var items = [];
            grupo.querySelectorAll('[data-fx]').forEach(function(el) {
                if (perteneceAlGrupo(el, grupo)) items.push(el);
            });
            if (!items.length) return;

            items.forEach(function(el, i) {
                if (!el.hasAttribute('data-fx-delay')) {
                    el.style.setProperty('--fx-delay', (i * paso) + 'ms');
                }
            });

            grupos.push({ el: grupo, items: items });
        });

        document.querySelectorAll('[data-fx][data-fx-delay]').forEach(function(el) {
            var retraso = parseInt(el.getAttribute('data-fx-delay'), 10);
            if (!isNaN(retraso)) el.style.setProperty('--fx-delay', retraso + 'ms');
        });

        document.documentElement.classList.add('fx-ready');

        function itemsDelGrupo(el) {
            for (var i = 0; i < grupos.length; i++) {
                if (grupos[i].el === el) return grupos[i].items;
            }
            return null;
        }

        var observador = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                var items = itemsDelGrupo(entry.target);
                if (!items) items = [entry.target];

                if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
                    items.forEach(function(el) { el.classList.add('fx-in'); });
                } else if (!entry.isIntersecting) {
                    items.forEach(function(el) {
                        var r = el.getBoundingClientRect();
                        if (r.bottom <= 0 || r.top >= window.innerHeight || r.right <= 0 || r.left >= window.innerWidth) {
                            el.classList.remove('fx-in');
                        }
                    });
                }
            });
        }, { threshold: [0, 0.12] });

        grupos.forEach(function(grupo) {
            observador.observe(grupo.el);
        });

        document.querySelectorAll('[data-fx]').forEach(function(el) {
            var padre = el.parentElement;
            while (padre) {
                if (padre.hasAttribute('data-fx-group')) return;
                padre = padre.parentElement;
            }
            observador.observe(el);
        });
    }

})(jQuery);
