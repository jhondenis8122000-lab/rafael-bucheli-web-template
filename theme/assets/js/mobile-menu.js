(() => {
    'use strict';

    const container = document.getElementById('mobile_menu');
    const source = document.getElementById('m_menu_active');
    if (!container || !source || container.children.length ||
        typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;

    const mobile = window.matchMedia('(max-width: 991px)');
    const cleanPath = (pathname) => pathname.replace(/\/+$/, '') || '/';
    const current = cleanPath(location.pathname);
    const linkIcons = {
        '/': 'fa-home',
        '/oferta-academica': 'fa-graduation-cap',
        '/servicios': 'fa-briefcase',
        '/nosotros': 'fa-school',
        '/contacto': 'fa-envelope',
    };

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }

    function icon(name) {
        const node = element('i', 'fas ' + name);
        node.setAttribute('aria-hidden', 'true');
        return node;
    }

    function linkData(anchor) {
        if (!anchor) return null;
        const label = anchor.textContent.trim();
        const url = new URL(anchor.href, document.baseURI);
        if (!label || !/^https?:$/.test(url.protocol) || url.origin !== location.origin) return null;
        return { label, url };
    }

    function navLink(data, isChild = false) {
        const link = element('a', isChild ? 'bb-mobile-sublink' : 'bb-mobile-link');
        link.href = data.url.href;
        const path = cleanPath(data.url.pathname);
        if (path === current) link.setAttribute('aria-current', 'page');
        if (!isChild) link.append(icon(linkIcons[path] || 'fa-chevron-right'));
        link.append(element('span', '', data.label));
        return link;
    }

    const toggle = element('button', 'bb-mobile-toggle');
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Abrir menú');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-haspopup', 'dialog');
    toggle.setAttribute('aria-controls', 'bb-mobile-menu-dialog');
    const bars = element('span', 'bb-mobile-toggle-bars');
    bars.setAttribute('aria-hidden', 'true');
    bars.append(element('span'), element('span'), element('span'));
    toggle.append(bars);

    const dialog = element('dialog', 'bb-mobile-overlay');
    dialog.id = 'bb-mobile-menu-dialog';
    dialog.setAttribute('aria-labelledby', 'bb-mobile-menu-title');

    const header = element('div', 'bb-mobile-header');
    const brand = element('div', 'bb-mobile-brand');
    const logo = document.querySelector('#header .logo img');
    if (logo) {
        const image = logo.cloneNode(false);
        image.alt = '';
        brand.append(image);
    }
    const title = element('h2', '', 'Menú');
    title.id = 'bb-mobile-menu-title';
    brand.append(title);

    const closeButton = element('button', 'bb-mobile-close-btn');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Cerrar menú');
    closeButton.setAttribute('autofocus', '');
    closeButton.append(icon('fa-times'));
    header.append(brand, closeButton);

    const content = element('div', 'bb-mobile-content');
    const nav = element('nav', 'bb-mobile-nav');
    nav.setAttribute('aria-label', 'Navegación principal');
    const list = element('ul', 'bb-mobile-list');
    nav.append(list);
    const groups = [];

    Array.from(source.children).forEach((item, index) => {
        if (item.classList.contains('middle-logo')) return;
        const parent = linkData(item.querySelector(':scope > a'));
        const children = Array.from(item.querySelectorAll(':scope > ul > li > a'))
            .map(linkData).filter(Boolean);
        const row = element('li', 'bb-mobile-item');

        if (!children.length || (children.length === 1 && parent && children[0].url.href === parent.url.href)) {
            if (!parent) return;
            row.append(navLink(parent));
        } else {
            const label = item.querySelector(':scope > a').textContent.trim();
            if (children[0].label === 'Academia') children[0].label = 'Niveles educativos';
            const button = element('button', 'bb-mobile-link bb-mobile-disclosure');
            button.type = 'button';
            button.append(icon('fa-graduation-cap'), element('span', '', label), icon('fa-chevron-down'));

            const submenu = element('ul', 'bb-mobile-submenu');
            submenu.id = 'bb-mobile-submenu-' + index;
            const active = children.some((child) => cleanPath(child.url.pathname) === current);
            if (active) button.classList.add('bb-mobile-section-current');
            button.setAttribute('aria-controls', submenu.id);
            children.forEach((child) => {
                const subrow = element('li');
                subrow.append(navLink(child, true));
                submenu.append(subrow);
            });

            const group = { button, submenu, active };
            groups.push(group);
            button.addEventListener('click', () => {
                const expand = submenu.hidden;
                groups.forEach((other) => setExpanded(other, other === group && expand));
            });
            row.append(button, submenu);
        }
        list.append(row);
    });

    function setExpanded({ button, submenu }, expanded) {
        submenu.hidden = !expanded;
        button.setAttribute('aria-expanded', String(expanded));
    }

    const portalSource = document.querySelector('#header a.portal-btn');
    content.append(nav);
    if (portalSource && /^https?:$/.test(portalSource.protocol)) {
        const portal = element('a', 'bb-mobile-portal');
        portal.href = portalSource.href;
        portal.target = '_blank';
        portal.rel = 'noopener noreferrer';
        portal.setAttribute('aria-label', 'Portal Web (abre en otra pestaña)');
        portal.append(icon('fa-user-graduate'), element('span', '', 'Portal Web'), icon('fa-external-link-alt'));
        content.append(portal);
    }

    dialog.append(header, content);
    container.append(toggle);
    document.body.append(dialog);

    let scrollTop = 0;
    function openMenu() {
        if (!mobile.matches || dialog.open) return;
        scrollTop = window.scrollY;
        groups.forEach((group) => setExpanded(group, group.active));
        content.scrollTop = 0;
        dialog.showModal();
        document.body.style.setProperty('--bb-menu-scroll-top', -scrollTop + 'px');
        document.body.classList.add('bb-mobile-menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        closeButton.focus({ preventScroll: true });
    }

    function closeMenu(restoreFocus = true) {
        if (!dialog.open) return;
        document.body.classList.remove('bb-mobile-menu-open');
        document.body.style.removeProperty('--bb-menu-scroll-top');
        toggle.setAttribute('aria-expanded', 'false');
        dialog.close();
        if (restoreFocus && mobile.matches) toggle.focus({ preventScroll: true });
        window.scrollTo({ top: scrollTop, behavior: 'instant' });
    }

    toggle.addEventListener('click', openMenu);
    closeButton.addEventListener('click', () => closeMenu());
    dialog.addEventListener('cancel', (event) => {
        event.preventDefault();
        closeMenu();
    });
    dialog.addEventListener('click', (event) => {
        if (event.target.closest('a[href]')) closeMenu();
    });
    mobile.addEventListener('change', () => {
        if (!mobile.matches) closeMenu(false);
    });
    window.addEventListener('pagehide', () => closeMenu(false));
})();

