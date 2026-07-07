# TODO - Normalización de enlaces (.html)

## Objetivo
Que todas las páginas naveguen correctamente usando **solo rutas con extensión** (ej: `servicios.html`, `contacto.html`, etc.), sin rutas tipo `/servicios`.

## Checklist
- [x] Recuperar/asegurar un `theme/servicios.html` válido (contenido provisto por el usuario).
- [ ] Reemplazar `theme/servicios.html` en el repo con el contenido limpio provisto.
- [ ] Normalizar enlaces internos en todas las páginas del menú/footer/CTAs:
  - [ ] `theme/index.html`
  - [ ] `theme/servicios.html`
  - [ ] `theme/nosotros.html`
  - [ ] `theme/admisiones.html`
  - [ ] `theme/contacto.html`
  - [ ] `theme/oferta_academica.html`
  - [ ] `theme/actividades_extracurriculares.html`
- [ ] Validar que no existan links con `href="/algo"` (sin `.html`).
- [ ] Validar que no existan links mal formados (por ejemplo `href="servicios.html">Servicios` partidos).

