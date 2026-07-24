$(document).ready(function() {
    // Hero Slider
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

    // Fullscreen Carousel
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

    // Common Carousel
    $('.commn-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 3 } }
    });

    // Testimonial Carousel
    $('.tst-carousel').owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        items: 1
    });

    // Contador animado
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const startTime = Date.now();
        function update() {
            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
        update();
    }

    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    counters.forEach(c => observer.observe(c));

    // Ocultar preloader
    setTimeout(function() {
        $('#preloader').addClass('hidden');
    }, 1500);
});