/*
  mobile-menu.js
  Menú móvil FULL SCREEN overlay.
  - El botón toggle se renderiza dentro de #mobile_menu (en el header)
  - El overlay se adjunta directamente al <body> para evitar problemas
    con backdrop-filter del header que rompe position:fixed en algunos navegadores
  - Submenús tipo acordeón
  - Cierra al hacer clic en toggle (X), overlay, ESC, o en enlaces
*/
(function($){
  "use strict";

  function escapeHtml(str){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'<')
      .replace(/>/g,'>')
      .replace(/"/g,'"')
      .replace(/'/g,'&#039;');
  }

  function buildSubmenuLinks($submenuUl){
    var html = '';
    $submenuUl.children('li').each(function(){
      var $li = $(this);
      var $a = $li.children('a').first();
      var label = ($a.text()||'').trim();
      var href = $a.attr('href') || '#';
      html += '<a class="bb-mobile-sublink" href="' + href + '">' + escapeHtml(label) + '</a>';
    });
    return html;
  }

  function buildMobileMenuItems($ul){
    var html = '';
    $ul.children('li').each(function(){
      var $li = $(this);
      var $a = $li.children('a').first();
      var label = ($a.text()||'').trim();
      var href = $a.attr('href') || '#';

      var $submenu = $li.children('ul.submenu').first();
      var hasSub = $submenu && $submenu.length;

      if (hasSub){
        var subId = 'bbSub_' + Math.random().toString(36).slice(2);
        html +=
          '<div class="bb-mobile-item bb-mobile-item-parent">' +
            '<a class="bb-mobile-link" href="#" role="button" data-bb-accordion-toggle ' +
              'aria-controls="' + subId + '" aria-expanded="false">' +
                escapeHtml(label) +
                '<span class="bb-mobile-arrow" aria-hidden="true">▾</span>' +
            '</a>' +
            '<div class="bb-mobile-submenu" id="' + subId + '">' +
              buildSubmenuLinks($submenu) +
            '</div>' +
          '</div>';
      } else {
        html +=
          '<div class="bb-mobile-item">' +
            '<a class="bb-mobile-link" href="' + href + '">' +
              escapeHtml(label) +
            '</a>' +
          '</div>';
      }
    });
    return html;
  }

  function initMobileMenu(){
    var $container = $('#mobile_menu');
    var $sourceMenu = $('ul#m_menu_active');
    if (!$container.length || !$sourceMenu.length) return;

    if ($container.data('mobile-menu-ready')) return;
    $container.data('mobile-menu-ready', true);

    // ================================================================
    // (1) Render toggle button DENTRO de #mobile_menu
    // ================================================================
    $container.html(
      '<button class="bb-mobile-toggle" type="button" aria-label="Menú" aria-expanded="false">' +
        '<span class="bb-mobile-toggle-bars" aria-hidden="true">' +
          '<span></span><span></span><span></span>' +
        '</span>' +
      '</button>'
    );

    var $toggle = $container.find('.bb-mobile-toggle');

    // ================================================================
    // (2) Render overlay DIRECTAMENTE en <body>
    //     Esto evita que el 'backdrop-filter' del header interfiera
    //     con 'position: fixed'
    // ================================================================
    var overlayMarkup =
      '<div class="bb-mobile-overlay" aria-hidden="true">' +
        '<div class="bb-mobile-fullscreen">' +
          '<div class="bb-mobile-header">' +
            '<span class="bb-mobile-title">Menú</span>' +
            '<button class="bb-mobile-close-btn" type="button" aria-label="Cerrar menú">' +
              '<i class="fas fa-times"></i>' +
            '</button>' +
          '</div>' +
          '<nav class="bb-mobile-nav" aria-label="Menú móvil">' +
            buildMobileMenuItems($sourceMenu) +
          '</nav>' +
        '</div>' +
      '</div>';

    $('body').append(overlayMarkup);

    var $overlay = $('body > .bb-mobile-overlay');

    // ================================================================
    // (3) Open / Close functions
    // ================================================================
    function open(){
      $overlay.addClass('open');
      $overlay.attr('aria-hidden','false');
      $toggle.attr('aria-expanded','true');
      $('body').addClass('bb-mobile-menu-open');
    }

    function close(){
      $overlay.removeClass('open');
      $overlay.attr('aria-hidden','true');
      $toggle.attr('aria-expanded','false');
      $('body').removeClass('bb-mobile-menu-open');
      $overlay.find('[data-bb-accordion-toggle]').attr('aria-expanded','false');
      $overlay.find('.bb-mobile-submenu').removeClass('open');
    }

    // Toggle hamburguesa
    $toggle.on('click', function(){
      var isOpen = $toggle.attr('aria-expanded') === 'true';
      if (isOpen) { close(); } else { open(); }
    });

    // Close button inside overlay
    $overlay.find('.bb-mobile-close-btn').on('click', function(){ close(); });

    // Click on overlay backdrop (fuera del contenedor blanco)
    $overlay.on('click', function(e){
      if (e.target === this) close();
    });

    // ESC key
    $(document).off('keydown.bbMobileMenu').on('keydown.bbMobileMenu', function(e){
      if (e.key === 'Escape' || e.keyCode === 27) close();
    });

    // Cerrar al hacer clic en enlaces de navegación
    $overlay.on('click', '.bb-mobile-link[href]:not([href="#"]):not([role="button"]), .bb-mobile-sublink', function(){
      close();
    });

    // ================================================================
    // (4) Accordion for submenus
    // ================================================================
    $overlay.off('click.bbMobileAccordion').on('click.bbMobileAccordion', '[data-bb-accordion-toggle]', function(e){
      e.preventDefault();
      var $btn = $(this);
      var targetId = $btn.attr('aria-controls');
      var $target = $('#'+targetId);
      if(!$target.length) return;

      var isOpen = $btn.attr('aria-expanded') === 'true';

      // Cerrar otros submenús abiertos
      $overlay.find('[data-bb-accordion-toggle]').each(function(){
        var $otherBtn = $(this);
        if($otherBtn[0] === $btn[0]) return;
        if($otherBtn.attr('aria-expanded') === 'true'){
          $('#'+$otherBtn.attr('aria-controls')).removeClass('open');
          $otherBtn.attr('aria-expanded','false');
        }
      });

      if(isOpen){
        $target.removeClass('open');
        $btn.attr('aria-expanded','false');
      } else {
        $target.addClass('open');
        $btn.attr('aria-expanded','true');
      }
    });
  }

  $(document).ready(function(){
    initMobileMenu();
  });

})(jQuery);

