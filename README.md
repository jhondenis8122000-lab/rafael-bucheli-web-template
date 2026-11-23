# Edification - Bootstrap Education Template ➜ [Demo](https://furioustheme-edification.netlify.app/)

[![Edification](https://furioustheme.com/products/edification.png)](https://furioustheme-edification.netlify.app/)

<!-- download -->
## Download And installation

### Vista previa del sitio Rafael Bucheli

Desde la raiz del repositorio, con Node.js instalado, ejecute `npm run serve`.
No requiere `npm install`. Abra <http://127.0.0.1:8098/> y pruebe las rutas
limpias, por ejemplo <http://127.0.0.1:8098/admisiones>. Si el puerto esta
ocupado, use `PORT=8099 npm run serve`.

Para cPanel, publique el contenido de `theme/` directamente en `public_html/`,
incluido `.htaccess`. El servidor local no reemplaza Apache ni reproduce sus
reglas de HTTPS, cache o compresion. No publique `.taste-skill/` ni archivos
del repositorio. Al descomprimir sobre una instalacion existente, los archivos
obsoletos no se eliminan solos.

### Navegacion compartida

Edite el encabezado en `partials/site-header.html` y los enlaces del pie
en `partials/footer-links.html`. Ejecute `npm run nav:sync` para actualizar
las paginas de `theme/` y `npm run nav:check` antes de empaquetar. No edite
manualmente los bloques entre comentarios `NAV`: se regeneran.

En cPanel solo se publica el contenido de `theme/`. Las plantillas y el
script se usan en el repositorio y no son necesarios en el hosting.

### Campana de inscripciones en pausa

`/admisiones` sigue accesible con su URL directa, pero no se enlaza desde la
navegacion y queda fuera del sitemap con `noindex`. El anuncio inicial se
conserva en `template#campana-matriculas-en-pausa` dentro de `index.html` y el
chatbot mantiene `showAdmissions: false`. Al reabrir la campana, revise el
periodo y los textos antes de volver a mostrarla.

### Seguridad e indexacion en produccion

- En cPanel, verifique HTTPS para el dominio raiz y `www`, confirme que
  `www.rafaelbucheli.com` redirige al dominio raiz y active ModSecurity si
  el proveedor lo ofrece. Mantenga copias del sitio fuera de `public_html`.
- El contacto usa Web3Forms. Active hCaptcha como obligatorio en el panel
  del proveedor y haga un envio de prueba desde el dominio publicado. Si el
  plan lo permite, limite el formulario a `rafaelbucheli.com`. La validacion
  del navegador y el campo trampa no sustituyen la validacion del proveedor.
- Para trafico automatizado abusivo, use el WAF del hosting o un proxy con
  limites de solicitudes basados en los registros. Excluya bots de busqueda
  verificados y no aplique desafios a todo el sitio. El WAF de la web no
  protege el endpoint externo de Web3Forms.
- Registre `rafaelbucheli.com` en Google Search Console, envie
  `https://rafaelbucheli.com/sitemap.xml` e inspeccione la portada y las
  paginas principales. Mantenga los datos del colegio en Google Maps
  alineados con la pagina de contacto. El sitemap no garantiza posiciones.
- `robots.txt` expresa preferencias de rastreo, no protege archivos ni
  detiene clientes que lo ignoran. Las paginas de utilidad y la campana
  pausada usan `noindex` sin bloquear su lectura a los buscadores.

Download this template from [Github](https://github.com/furioustheme/edification/archive/refs/heads/main.zip)

<!-- installation -->
### Basic Usages

After downloading the template, you can simply edit the HTML and CSS files from the `theme` folder. To preview the changes you make to the code, you can open the index.html file in your web browser.

### Advanced Usage

For advanced usage, you have some prerequisites to install. Then you can run it on your localhost. You can view the package.json file to see which scripts are included.

#### Install prerequisites (once for a machine)

* **Node Installation:** [Install node js](https://nodejs.org/en/download/)
* **Gulp Installation:** Install gulp globally from your terminal

```
npm install --global gulp-cli
```

Or visit the original [Gulp docs](https://gulpjs.com/docs/en/getting-started/quick-start)

#### Local setup

After successfully installing those dependencies, open this theme with any IDE [[VS Code](https://code.visualstudio.com/) recommended], and then open the internal terminal of IDM [vs code shortcut <code>ctrl/cmd+\`</code>]

* Install dependencies

```
npm install
```

* Run locally

```
npm run dev
```

After that, it will open up a preview of the template in your default browser, watch for changes to theme files, and live reload the browser when changes are saved.

<!-- licence -->
## License

Copyright (c) 2015 - Present, Designed & Developed by [Furioustheme](https://furioustheme.com)

**Code License:** Released under the [MIT](https://github.com/furioustheme/edification/blob/main/LICENSE) license.

**Image license:** The images are only for demonstration purposes. They have their license, we don't have permission to share those images.
