/*============================
   scripts.js - COMPLETO
   ============================*/

(function($) {
    "use strict";

    /*================================
    INICIALIZACIÓN PRINCIPAL
    ==================================*/
    $(document).ready(function() {
        // 1. Efectos del header (scroll)
        initHeaderEffects();

        // 2. Animaciones al hacer scroll
        initAnimations();

        // 3. Búsqueda (offcanvas)
        initSearch();

        // 4. Scroll suave para anclas
        initSmoothScroll();

        // 5. Contadores animados
        initCounters();

        // 6. Carruseles (todos los que usa el sitio)
        initCarousels();

        // 7. Video popup (magnific)
        initVideoPopup();

        // 8. Efectos de tarjetas (retrasos de animación)
        initCardEffects();
    });

    /*================================
    1. HEADER EFFECTS (SCROLL + SLICKNAV)
    ==================================*/
    function initHeaderEffects() {
        // Cambiar clase al hacer scroll
        $(window).on('scroll', function() {
            var scroll = $(window).scrollTop();
            $('.header-two').toggleClass('scrolled', scroll > 50);
        });

        // INICIALIZACIÓN DE SLICKNAV (MENÚ MÓVIL)
        // Eliminado: el menú móvil fue rediseñado sin slicknav.

        // initMobileMenu ahora vive en assets/js/mobile-menu.js (nuevo menú sin slicknav)
    }

    /*================================
      INIT MOBILE MENU
      (Ahora manejado por assets/js/mobile-menu.js)
    ==================================*/
    // La función initMobileMenu y sus helpers fueron movidos a mobile-menu.js
    // para evitar duplicación de código.



    /*================================
    2. ANIMACIONES AL SCROLL
    ==================================*/
    function initAnimations() {
        function animateOnScroll() {
            $('.animate-fadeInUp, .animate-fadeInLeft, .animate-fadeInRight, .animate-zoomIn').each(function() {
                if (isElementInViewport($(this))) {
                    $(this).addClass('animated');
                }
            });
        }

        function isElementInViewport($element, offset = 0) {
            var elementTop = $element.offset().top;
            var elementBottom = elementTop + $element.outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            return (elementBottom > viewportTop && elementTop < viewportBottom - offset);
        }

        $(window).on('scroll', animateOnScroll);
        $(window).on('load', animateOnScroll);
    }

    /*================================
    3. BÚSQUEDA OFFCANVAS
    ==================================*/
    function initSearch() {
        var $offsetSearch = $('.offset-search');
        var $bodyOverlay = $('.body_overlay');

        $('.search_btn').on('click', function() {
            toggleSearch(true);
        });

        $bodyOverlay.on('click', function() {
            toggleSearch(false);
        });

        function toggleSearch(show) {
            var method = show ? 'addClass' : 'removeClass';
            $offsetSearch[method]('show_hide');
            $bodyOverlay[method]('show_hide');
        }
    }

    /*================================
    4. SCROLL SUAVE PARA ANCLAS
    ==================================*/
    function initSmoothScroll() {
        $(document).on('click', 'a[href^="#"]', function(event) {
            var href = $(this).attr('href');
            if (href && href.length > 1 && href !== '#' && $(href).length) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: $(href).offset().top - 50
                }, 1000);
            }
        });
    }

    /*================================
    5. CONTADORES ANIMADOS
    ==================================*/
    function initCounters() {
        var countersStarted = false;

        function startCounters() {
            $('.counter').each(function() {
                var $this = $(this);
                var target = parseInt($this.data('target'));
                $this.text('0');
                var currentNum = 0;
                var increment = Math.ceil(target / 50);
                var timer = setInterval(function() {
                    currentNum += increment;
                    if (currentNum >= target) {
                        $this.text(target + (target > 100 ? '+' : ''));
                        clearInterval(timer);
                    } else {
                        $this.text(currentNum + (target > 100 ? '+' : ''));
                    }
                }, 30);
            });
        }

        function checkCounters() {
            if (countersStarted) return;
            var $statsCard = $('.hero-stats-card-3d');
            if ($statsCard.length && isElementInViewport($statsCard, 100)) {
                startCounters();
                countersStarted = true;
            }
        }

        checkCounters();
        $(window).on('scroll', checkCounters);
    }

    function isElementInViewport($element, offset = 0) {
        var elementTop = $element.offset().top;
        var viewportBottom = $(window).scrollTop() + $(window).height();
        return elementTop < viewportBottom - offset;
    }

    /*================================
    6. CARRUSELES (todos)
    ==================================*/
    function initCarousels() {
        // 6.1 Hero Slider (principal)
        if ($('#heroSlider').length) {
            $('#heroSlider').owlCarousel({
                loop: true,
                items: 1,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 5500,
                autoplayHoverPause: true,
                smartSpeed: 800,
                animateOut: 'fadeOut',
                animateIn: 'fadeIn'
            });
        }

        // 6.2 Fullscreen Carousel (sección de servicios)
        if ($('.fullscreen-carousel').length) {
            $('.fullscreen-carousel').owlCarousel({
                loop: true,
                items: 1,
                nav: true,
                dots: true,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: true,
                animateOut: 'fadeOut',
                animateIn: 'fadeIn',
                smartSpeed: 800,
                navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>']
            });
        }

        // 6.3 Carrusel común (metodologías, docentes, etc.)
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

        // 6.4 Blog carousel (si existe)
        if ($('.blog-carousel').length) {
            $('.blog-carousel').owlCarousel({
                loop: true,
                autoplay: false,
                dots: false,
                nav: true,
                navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
                smartSpeed: 800,
                responsive: {
                    0: { items: 1 },
                    480: { items: 1 },
                    768: { items: 2 },
                    1024: { items: 3 }
                }
            });
        }

        // 6.5 Testimonios
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
    7. VIDEO POPUP
    ==================================*/
    function initVideoPopup() {
        $('.expand-video').magnificPopup({
            type: 'iframe',
            gallery: { enabled: true }
        });
    }

    /*================================
    8. EFECTOS DE TARJETAS (retrasos)
    ==================================*/
    function initCardEffects() {
        $('.course-area .card, .teacher-area .card, .feature-blog .card').each(function(index) {
            $(this).css('animation-delay', (index * 0.2) + 's');
        });
    }

})(jQuery);

/*================================
GOOGLE MAPS (opcional)
==================================*/
function initMap() {
    var mapElement = document.getElementById('google_map');
    if (!mapElement) return;
    var map = new google.maps.Map(mapElement, {
        center: { lat: 40.674, lng: -73.945 },
        scrollwheel: false,
        zoom: 12
    });
    new google.maps.Marker({
        position: map.getCenter(),
        map: map
    });
}



