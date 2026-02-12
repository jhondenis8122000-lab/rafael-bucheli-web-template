/*============================
   js index
==============================

==========================================*/

(function($) {
    "use strict";
 

    /*================================
    Preloader
    ==================================*/
    var preloader = $('#preloader');
    $(window).on('load', function() {
        preloader.fadeOut('slow', function() { $(this).remove(); });
    });


    /*================================
    stickey Header
    ==================================*/
    $(window).on('scroll', function() {
        var scroll = $(window).scrollTop(),
            mainHeader = $('.header-bottom');

        if (scroll > 50) {
            mainHeader.addClass("sticky-header");
        } else {
            mainHeader.removeClass("sticky-header");
        }
    });

    /*================================
    Scroll-triggered Animations
    ==================================*/
    function animateOnScroll() {
        $('.animate-fadeInUp, .animate-fadeInLeft, .animate-fadeInRight, .animate-zoomIn, .animate-bounceIn').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animated');
            }
        });

        // Animate sections on scroll
        $('.course-area, .teacher-area, .event-area, .testimonial-area, .feature-blog').each(function() {
            var elementTop = $(this).offset().top;
            var viewportBottom = $(window).scrollTop() + $(window).height();

            if (elementTop < viewportBottom - 100) {
                $(this).addClass('animate-in');
            }
        });
    }

    // Trigger on scroll and load
    $(window).on('scroll', animateOnScroll);
    $(window).on('load', animateOnScroll);

    /*================================
    Highlight Phrase Effects
    ==================================*/
    function initHighlightEffects() {
        // Typing effect for highlight phrase (optional)
        var highlightPhrase = $('.highlight-phrase');
        if (highlightPhrase.length) {
            var text = highlightPhrase.text();
            highlightPhrase.text('');
            var i = 0;
            var timer = setInterval(function() {
                if (i < text.length) {
                    highlightPhrase.append(text.charAt(i));
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, 100);
        }

        // Add interactive hover for highlight phrase
        highlightPhrase.on('mouseenter', function() {
            $(this).addClass('glow');
        }).on('mouseleave', function() {
            $(this).removeClass('glow');
        });
    }

    // Initialize highlight effects on load
    $(window).on('load', initHighlightEffects);

    /*================================
    Enhanced Card Interactions
    ==================================*/
    $('.card').on('mouseenter', function() {
        $(this).find('.course-thumb img').addClass('tilt');
    }).on('mouseleave', function() {
        $(this).find('.course-thumb img').removeClass('tilt');
    });

    /*================================
    Parallax and Floating Effects
    ==================================*/
    function parallaxEffect() {
        var scrolled = $(window).scrollTop();
        $('.hero-area').css('background-position', 'center ' + (scrolled * 0.5) + 'px');
    }

    $(window).on('scroll', parallaxEffect);

    /*================================
    Smooth Scrolling
    ==================================*/
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 50
            }, 1000);
        }
    });


    /*================================
    offste search
    ==================================*/
    var offsetSearch = $('.offset-search');
    var bodyOverlay = $('.body_overlay');
    $('.search_btn').on('click', function() {
        $(offsetSearch).addClass('show_hide');
        $(bodyOverlay).addClass('show_hide');
    });
    bodyOverlay.on('click', function() {
        $(offsetSearch).removeClass('show_hide');
        $(bodyOverlay).removeClass('show_hide');
    });


    /*================================
    Owl Carousel
    ==================================*/
    // slider_area carousel active
    function slider_area() {
        $('.slider-area').owlCarousel({
            margin: 0,
            loop: true,
            autoplay: false,
            autoplayTimeout: 4000,
            nav: true,
            items: 1,
            smartSpeed: 800,
            navText: ['<i><img src="assets/images/angle-left.png" alt="icon"/></i><span>prev</span>', '<span>next</span><i><img src="assets/images/angle-right.png" alt="icon"/></i>']
        });
    };
    slider_area();


    // course_carousel carousel active
    function course_carousel() {
        $('.course-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            dots: false,
            autoplayTimeout: 4000,
            nav: true,
            smartSpeed: 800,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            responsive: {
                0: {
                    items: 1,
                    margin: 5
                },
                480: {
                    items: 1,
                    margin: 30
                },
                768: {
                    items: 2,
                    margin: 30
                },
                1024: {
                    items: 3,
                    margin: 30
                }
            }
        });
    };
    course_carousel();


    // commn_carousel carousel active
    function commn_carousel() {
        $('.commn-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            dots: true,
            margin: 0,
            autoplayTimeout: 4000,
            nav: false,
            dotsEach: true,
            smartSpeed: 800,
            responsive: {
                0: {
                    items: 1, 
                },
                480: {
                    items: 1, 
                },
                768: {
                    items: 2, 
                },
                1024: {
                    items: 3,
                }
            }
        });
    };
    commn_carousel();


    // teacher_carousel carousel active
    function teacher_carousel() {
        $('.teacher-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            dots: false,
            margin: 0,
            autoplayTimeout: 4000,
            nav: true,
            smartSpeed: 800,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            responsive: {
                0: {
                    items: 1 
                },
                480: {
                    items: 1 
                },
                768: {
                    items: 2 
                },
                1024: {
                    items: 3 
                }
            }
        });
    };
    teacher_carousel();


    // blog_carousel carousel active
    function blog_carousel() {
        $('.blog-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            margin: 0,
            dots: false,
            autoplayTimeout: 4000,
            nav: true,
            smartSpeed: 800,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            responsive: {
                0: {
                    items: 1 
                },
                480: {
                    items: 1
                },
                768: {
                    items: 2 
                },
                1024: {
                    items: 3 
                }
            }
        });
    };
    blog_carousel();


    // tst_carousel carousel active
    function tst_carousel() {
        $('.tst-carousel').owlCarousel({
            loop: true,
            autoplay: false,
            dots: true,
            items: 1,
            autoplayTimeout: 4000,
            nav: false,
            smartSpeed: 800,
            mouseDrag: false
        });
    };
    tst_carousel();

    $('.expand-video').magnificPopup({
        type: 'iframe',
        gallery: {
            enabled: true
        }
    });


    /*================================
    slicknav
    ==================================*/
    $('ul#m_menu_active').slicknav({
        prependTo: "#mobile_menu"
    });

})(jQuery);



// google map activation
function initMap() {
    // Styles a map in night mode.
    var map = new google.maps.Map(document.getElementById('google_map'), {
        center: { lat: 40.674, lng: -73.945 },
        scrollwheel: false,
        zoom: 12,
        styles: [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "poi.business",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            }
        ]
    });
    var marker = new google.maps.Marker({
        position: map.getCenter(),
        map: map
    });
}
// ============================================
// HERO PREMIUM - CONTADORES ANIMADOS
// ============================================

(function($) {
    "use strict";
    
    $(document).ready(function() {
        
        // CONTADORES ANIMADOS
        function startCounters() {
            $('.counter').each(function() {
                var $this = $(this);
                var target = parseInt($this.attr('data-target'));
                var current = parseInt($this.text());
                
                if (current !== 0 && !isNaN(current) && current !== target) {
                    return;
                }
                
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
        
        // DETECTAR CUANDO LOS CONTADORES SON VISIBLES
        var countersStarted = false;
        
        function checkCounters() {
            if (countersStarted) return;
            
            var $statsCard = $('.hero-stats-card-3d');
            if ($statsCard.length) {
                var windowTop = $(window).scrollTop();
                var windowBottom = windowTop + $(window).height();
                var elementTop = $statsCard.offset().top;
                
                if (elementTop < windowBottom - 100) {
                    startCounters();
                    countersStarted = true;
                }
            }
        }
        
        checkCounters();
        $(window).on('scroll', function() {
            checkCounters();
        });
        
        // SMOOTH SCROLL PARA EL INDICADOR
        $('.scroll-link-premium').on('click', function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            
            if ($(target).length) {
                $('html, body').animate({
                    scrollTop: $(target).offset().top - 100
                }, 1000);
            }
        });
        
    });
    
})(jQuery);