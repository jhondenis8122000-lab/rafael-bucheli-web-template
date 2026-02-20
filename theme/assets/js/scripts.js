/*============================
   js index - VERSIÓN SIMPLIFICADA (UN SOLO SLIDER)
============================*/

(function($) {
    "use strict";

    /*================================
    INICIALIZACIÓN
    ==================================*/
    $(document).ready(function() {
        initPreloader();
        initHeaderEffects();
        initAnimations();
        initSearch();
        initSmoothScroll();
        initCounters();
        initCardEffects();
        initVideoPopup();
    });

    /*================================
    PRELOADER
    ==================================*/
    function initPreloader() {
        var preloader = $('#preloader');
        $(window).on('load', function() {
            preloader.fadeOut('slow', function() { 
                $(this).remove(); 
            });
        });
    }

    /*================================
    HEADER EFFECTS
    ==================================*/
    function initHeaderEffects() {
        // Header scroll effect
        $(window).on('scroll', function() {
            var scroll = $(window).scrollTop();
            $('.header-two').toggleClass('scrolled', scroll > 50);
        });

        // Mobile menu
        $('ul#m_menu_active').slicknav({
            prependTo: "#mobile_menu"
        });
    }

    /*================================
    ANIMACIONES SCROLL
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
    SEARCH OFFCANVAS
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
    SMOOTH SCROLL
    ==================================*/
    function initSmoothScroll() {
        $('a[href^="#"]').on('click', function(event) {
            var target = $(this.getAttribute('href'));
            if (target.length) {
                event.preventDefault();
                $('html, body').stop().animate({
                    scrollTop: target.offset().top - 50
                }, 1000);
            }
        });
    }

    /*================================
    CONTADORES ANIMADOS
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

    // Helper para viewport
    function isElementInViewport($element, offset = 0) {
        var elementTop = $element.offset().top;
        var viewportBottom = $(window).scrollTop() + $(window).height();
        return elementTop < viewportBottom - offset;
    }

    /*================================
    CARD EFFECTS (para cursos, docentes, blog)
    ==================================*/
    function initCardEffects() {
        // Carruseles existentes (si los tienes)
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

        // Animation delays
        $('.course-area .card, .teacher-area .card, .feature-blog .card').each(function(index) {
            $(this).css('animation-delay', (index * 0.2) + 's');
        });
    }

    /*================================
    VIDEO POPUP
    ==================================*/
    function initVideoPopup() {
        $('.expand-video').magnificPopup({
            type: 'iframe',
            gallery: { enabled: true }
        });
    }

})(jQuery);

/*================================
GOOGLE MAPS (si lo usas)
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