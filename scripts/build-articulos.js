#!/usr/bin/env node
'use strict';

/**
 * Generador de la sección de artículos.
 *
 *   node scripts/build-articulos.js        (o: npm run articulos)
 *
 * Lee articulos/*.md con frontmatter y articulos/autores.json, y escribe:
 *
 *   articulos/<slug>.html          una página por artículo
 *   articulos/index.html           el índice
 *   feed.xml                       RSS 2.0
 *   sitemap.xml                    entradas de artículos, entre marcas
 *   review/linkedin/<slug>.md      borrador del post para LinkedIn
 *
 * Todo lo generado se sobrescribe en cada pasada: no editar a mano los .html
 * de articulos/, se pierden. La fuente de verdad son los .md.
 */

const fs = require('fs');
const path = require('path');
const md = require('./lib/markdown.js');
const parciales = require('./lib/parciales.js');

const RAIZ = path.resolve(__dirname, '..');
const DIR_ARTICULOS = path.join(RAIZ, 'articulos');
const DIR_FRAGMENTOS = path.join(DIR_ARTICULOS, 'fragmentos');
const DIR_LINKEDIN = path.join(RAIZ, 'review', 'linkedin');

// Dominio público del sitio. Lo reescribe scripts/cambiar-dominio.js cuando
// sergioargudo.es esté activo; no editarlo a mano en dos sitios distintos.
const SITIO = 'https://sergioargudosantiago.github.io';

const PALABRAS_POR_MINUTO = 200;

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
    'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

// --- Utilidades -----------------------------------------------------------

function fechaLarga(iso) {
    const [a, m, d] = iso.split('-').map(Number);
    return `${d} de ${MESES[m - 1]} de ${a}`;
}

function fechaRFC822(iso) {
    return new Date(`${iso}T09:00:00Z`).toUTCString();
}

function slugificar(texto) {
    return String(texto || '')
        .normalize('NFD').replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Frontmatter YAML acotado: escalares, listas en línea y listas con guion. */
function leerFrontmatter(texto) {
    const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) throw new Error('falta el bloque de frontmatter entre --- y ---');

    const datos = {};
    const lineas = m[1].split(/\r?\n/);
    let claveLista = null;

    for (const linea of lineas) {
        if (!linea.trim() || /^\s*#/.test(linea)) continue;

        const item = linea.match(/^\s*-\s+(.*)$/);
        if (item && claveLista) {
            datos[claveLista].push(desentrecomillar(item[1]));
            continue;
        }

        const par = linea.match(/^([\w-]+)\s*:\s*(.*)$/);
        if (!par) continue;
        const [, clave, bruto] = par;
        const valor = bruto.trim();

        if (valor === '') {                       // lista con guiones debajo
            datos[clave] = [];
            claveLista = clave;
        } else if (/^\[.*\]$/.test(valor)) {      // lista en línea
            datos[clave] = valor.slice(1, -1).split(',')
                .map(v => desentrecomillar(v.trim())).filter(Boolean);
            claveLista = null;
        } else {
            datos[clave] = desentrecomillar(valor);
            claveLista = null;
        }
    }
    return { datos, cuerpo: m[2] };
}

function desentrecomillar(v) {
    const t = String(v).trim();
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
        return t.slice(1, -1);
    }
    return t;
}

// --- Fragmentos comunes de plantilla --------------------------------------

// `base` es el prefijo hacia la raíz del sitio: '' desde la raíz, '../' desde
// articulos/. Todas las rutas relativas de las plantillas pasan por aquí.
// La cabecera, el pie y las fuentes salen de src/parciales/, los mismos que
// usan las páginas sueltas; los estilos, de css/sitio.css.

function cabeceraHTML({ titulo, descripcion, url, imagen, base, tipo, extra, imagenPropia }) {
    // og:image:width/height solo cuando la imagen es la portada del sitio, cuyo
    // tamaño conocemos. Declarar 1200x630 para una imagen propia de otra
    // proporción hace que la tarjeta social salga recortada o deformada.
    const dimsImagen = imagenPropia ? '' :
        `    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
`;
    return `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#3B4533">
    <meta name="description" content="${md.escapeAttr(descripcion)}">
    <title>${md.escapeHTML(titulo)}</title>
    <link rel="canonical" href="${url}">
    <link rel="icon" href="${base}logos/png/SAS-icono-claro.png?v=2" type="image/png">
    <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="alternate" type="application/rss+xml" title="Artículos — Sergio Argudo Santiago" href="${SITIO}/feed.xml">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <meta name="author" content="Sergio Argudo Santiago">
    <meta property="og:type" content="${tipo}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${md.escapeAttr(titulo)}">
    <meta property="og:description" content="${md.escapeAttr(descripcion)}">
    <meta property="og:image" content="${imagen}">
${dimsImagen}    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${md.escapeAttr(titulo)}">
    <meta property="twitter:description" content="${md.escapeAttr(descripcion)}">
    <meta property="twitter:image" content="${imagen}">
${extra || ''}
    <link rel="stylesheet" href="${base}css/tailwind.css">
    ${parciales.bloque('recursos', { raiz: base })}
</head>`;
}

function cuerpoComun({ base, activo }) {
    return {
        cabecera: `    ${parciales.bloque('cabecera', { raiz: base, seccion: activo })}`,
        pie: `    ${parciales.bloque('pie', { raiz: base })}

    <script src="${base}js/main.js"></script>
</body>

</html>`
    };
}

function listaEtiquetas(tags) {
    if (!tags.length) return '';
    return `<div class="c-etiquetas">${tags.map(t => `<span class="c-etiqueta">${md.escapeHTML(t)}</span>`).join('')}</div>`;
}

// --- Plantillas -----------------------------------------------------------

function paginaArticulo(art, autores) {
    const url = `${SITIO}/articulos/${art.slug}.html`;
    const imagen = art.imagen ? `${SITIO}/${art.imagen}` : `${SITIO}/images/og-cover.png`;
    const firmas = art.autores.map(id => autores[id]).filter(Boolean);

    const jsonLD = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: art.titulo,
        description: art.resumen,
        datePublished: art.fecha,
        image: imagen,
        url,
        author: firmas.map(a => ({ '@type': 'Person', name: a.nombre, url: a.url || undefined })),
        keywords: art.tags.join(', '),
        inLanguage: 'es'
    };

    const partes = cuerpoComun({ base: '../', activo: 'articulos' });

    const cabecera = cabeceraHTML({
        titulo: `${art.titulo} — Sergio Argudo Santiago`,
        descripcion: art.resumen,
        url, imagen, base: '../', tipo: 'article', imagenPropia: !!art.imagen,
        extra: `    <meta property="article:published_time" content="${art.fecha}">
${art.tags.map(t => `    <meta property="article:tag" content="${md.escapeAttr(t)}">`).join('\n')}
${art.css.map(c => `    <link rel="stylesheet" href="../${c}">`).join('\n')}${art.css.length ? '\n' : ''}    <script type="application/ld+json">${JSON.stringify(jsonLD)}</script>`
    });

    const bloqueFirmas = firmas.map(a => {
        const nombre = md.escapeHTML(a.nombre);
        const enlace = a.url
            ? `<a href="${md.escapeAttr(a.url)}" target="_blank" rel="noopener noreferrer">${nombre}</a>`
            : nombre;
        return `<span>${enlace}${a.cargo ? `, ${md.escapeHTML(a.cargo)}` : ''}</span>`;
    }).join('');

    return `${cabecera}

<body class="c-pagina flex min-h-screen flex-col">

${partes.cabecera}

    <main class="c-principal">
        <article class="c-columna">

            <a href="index.html" class="c-volver">&larr; Todos los artículos</a>

            <header class="c-articulo-cabecera">
                ${art.tags.length ? `<p class="c-antetitulo">${art.tags.map(md.escapeHTML).join(' · ')}</p>` : ''}
                <h1 class="c-titular">${md.escapeHTML(art.titulo)}</h1>
                <p class="c-entradilla">${md.escapeHTML(art.resumen)}</p>
                <div class="c-meta">
                    <time datetime="${art.fecha}">${fechaLarga(art.fecha)}</time>
                    <span>${art.minutos} min de lectura</span>
                    ${bloqueFirmas}
                </div>
            </header>

            <div class="art-cuerpo">
${art.html}
            </div>

            <footer class="c-articulo-pie">
                <p class="c-antetitulo">Compartir</p>
                <div class="c-compartir">
                    <a class="c-boton c-boton-principal" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer">Compartir en LinkedIn</a>
                    <button type="button" class="c-boton" id="btnCopiarEnlace" data-url="${url}">Copiar enlace</button>
                    <a class="c-boton" href="../feed.xml">RSS</a>
                </div>
            </footer>

        </article>
    </main>

${partes.pie.replace('</body>', `${art.js.map(j => `    <script src="../${j}"></script>`).join('\n')}${art.js.length ? '\n' : ''}    <script>
    // ggiraph dibuja el SVG al cargar la página, con role="img" y sin nombre:
    // se le da el texto alternativo del marcador incluir y se ocultan los iconos.
    window.addEventListener('load', function () {
        setTimeout(function () {
            document.querySelectorAll('.art-figura[data-alt]').forEach(function (fig) {
                var svgs = fig.querySelectorAll('svg');
                svgs.forEach(function (svg) {
                    if (svg.closest('.ggiraph-toolbar')) svg.setAttribute('aria-hidden', 'true');
                });
                var principal = Array.prototype.find.call(svgs, function (svg) { return !svg.closest('.ggiraph-toolbar'); });
                if (principal) { principal.setAttribute('role', 'img'); principal.setAttribute('aria-label', fig.dataset.alt); }
            });
        }, 300);
    });
    (function () {
        var btn = document.getElementById('btnCopiarEnlace');
        if (!btn || !navigator.clipboard) return;
        btn.addEventListener('click', function () {
            navigator.clipboard.writeText(btn.dataset.url).then(function () {
                var antes = btn.textContent;
                btn.textContent = 'Copiado';
                setTimeout(function () { btn.textContent = antes; }, 1800);
            });
        });
    })();
    </script>
</body>`)}`;
}

function paginaIndice(articulos, autores) {
    const url = `${SITIO}/articulos/index.html`;
    const partes = cuerpoComun({ base: '../', activo: 'articulos' });
    const cabecera = cabeceraHTML({
        titulo: 'Artículos — Sergio Argudo Santiago',
        descripcion: 'Artículos sobre comercio exterior, política comercial y la preparación de la oposición al SOIVRE.',
        url, imagen: `${SITIO}/images/og-cover.png`, base: '../', tipo: 'website'
    });

    const tarjetas = articulos.map(art => {
        const firmas = art.autores.map(id => autores[id]).filter(Boolean)
            .map(a => md.escapeHTML(a.nombre)).join(', ');
        return `                <a href="${art.slug}.html" class="c-tarjeta-articulo">
                    <div class="c-meta">
                        <time datetime="${art.fecha}">${fechaLarga(art.fecha)}</time>
                        <span>${art.minutos} min</span>
                        ${firmas ? `<span>${firmas}</span>` : ''}
                    </div>
                    <h2>${md.escapeHTML(art.titulo)}</h2>
                    <p>${md.escapeHTML(art.resumen)}</p>
                    ${listaEtiquetas(art.tags)}
                </a>`;
    }).join('\n');

    const vacio = `                <p class="c-tarjeta-articulo">Todavía no hay ningún artículo publicado.</p>`;

    return `${cabecera}

<body class="c-pagina flex min-h-screen flex-col">

${partes.cabecera}

    <main class="c-principal">
        <div class="c-columna">

            <header class="c-indice-cabecera">
                <p class="c-antetitulo">Análisis</p>
                <h1 class="c-titular">Artículos</h1>
                <p class="c-entradilla">Comercio exterior, política comercial y preparación de la oposición. Con fuentes y datos que puedes comprobar.</p>
                <p><a class="c-boton" href="../feed.xml">Suscribirse por RSS</a></p>
            </header>

            <div class="c-lista-articulos">
${articulos.length ? tarjetas : vacio}
            </div>

        </div>
    </main>

${partes.pie}`;
}

function feedRSS(articulos, autores) {
    const items = articulos.map(art => {
        const url = `${SITIO}/articulos/${art.slug}.html`;
        const firmas = art.autores.map(id => autores[id]).filter(Boolean).map(a => a.nombre).join(', ');
        return `    <item>
      <title>${md.escapeHTML(art.titulo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${fechaRFC822(art.fecha)}</pubDate>
      <description>${md.escapeHTML(art.resumen)}</description>
${firmas ? `      <dc:creator>${md.escapeHTML(firmas)}</dc:creator>\n` : ''}${art.tags.map(t => `      <category>${md.escapeHTML(t)}</category>`).join('\n')}
    </item>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Artículos — Sergio Argudo Santiago</title>
    <link>${SITIO}/articulos/index.html</link>
    <description>Comercio exterior, política comercial y preparación de la oposición al SOIVRE.</description>
    <language>es-ES</language>
    <atom:link href="${SITIO}/feed.xml" rel="self" type="application/rss+xml"/>
${articulos.length ? `    <lastBuildDate>${fechaRFC822(articulos[0].fecha)}</lastBuildDate>\n` : ''}${items}
  </channel>
</rss>
`;
}

/** Tarjeta del último artículo en la portada, entre marcas en index.html. */
function actualizarPortada(articulos) {
    const ruta = path.join(RAIZ, 'index.html');
    const html = fs.readFileSync(ruta, 'utf8');
    const re = /<!-- ultimo-articulo:inicio -->[\s\S]*?<!-- ultimo-articulo:fin -->/;
    if (!re.test(html)) return;
    const art = articulos[0];
    const tarjeta = art ? `
                    <a class="c-tarjeta-enlace" href="articulos/${art.slug}.html">
                        <span class="c-antetitulo">Último artículo · ${fechaLarga(art.fecha)}</span>
                        <span class="c-titulo-tarjeta">${md.escapeHTML(art.titulo)}</span>
                        <span>${md.escapeHTML(art.resumen)}</span>
                    </a>
                    ` : '';
    const nuevo = html.replace(re, () => `<!-- ultimo-articulo:inicio -->${tarjeta}<!-- ultimo-articulo:fin -->`);
    if (nuevo !== html) fs.writeFileSync(ruta, nuevo, 'utf8');
}

function actualizarSitemap(articulos) {
    const ruta = path.join(RAIZ, 'sitemap.xml');
    let xml = fs.readFileSync(ruta, 'utf8');

    const inicio = '  <!-- articulos:inicio -->';
    const fin = '  <!-- articulos:fin -->';

    const entradas = [
        `  <url>
    <loc>${SITIO}/articulos/index.html</loc>
    <lastmod>${articulos.length ? articulos[0].fecha : hoyISO()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
        ...articulos.map(art => `  <url>
    <loc>${SITIO}/articulos/${art.slug}.html</loc>
    <lastmod>${art.fecha}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`)
    ].join('\n');

    const bloque = `${inicio}\n${entradas}\n${fin}`;

    if (xml.includes(inicio) && xml.includes(fin)) {
        xml = xml.replace(new RegExp(`${inicio}[\\s\\S]*?${fin}`), bloque);
    } else {
        xml = xml.replace('</urlset>', `${bloque}\n</urlset>`);
    }
    fs.writeFileSync(ruta, xml, 'utf8');
}

function hoyISO() {
    return new Date().toISOString().slice(0, 10);
}

/**
 * Sustituye los marcadores <!--incluir: fichero.html--> por el contenido de
 * articulos/fragmentos/. Sirve para meter en un artículo un trozo de HTML que
 * no tiene sentido escribir a mano ni tener dentro del .md: por ejemplo un
 * gráfico interactivo exportado desde R, cuyo payload son doce mil caracteres
 * de JSON que dejarían el Markdown ilegible.
 *
 * Se aplica después de renderizar: el marcador es un comentario HTML y el
 * renderizador lo deja pasar intacto.
 */
function incluirFragmentos(html, contexto) {
    // <!--incluir: fichero.html | texto alternativo--> : el texto, opcional pero
    // muy recomendable para gráficos, es lo que oye quien usa lector de pantalla.
    return html.replace(/<!--\s*incluir:\s*([\w.-]+)\s*(?:\|\s*([\s\S]*?))?\s*-->/g, (_, fichero, alt) => {
        const ruta = path.join(DIR_FRAGMENTOS, fichero);
        if (!fs.existsSync(ruta)) {
            throw new Error(`${contexto}: el fragmento "${fichero}" no existe en articulos/fragmentos/`);
        }
        const fragmento = fs.readFileSync(ruta, 'utf8');
        return alt ? `<div class="art-figura" data-alt="${md.escapeAttr(alt.trim())}">\n${fragmento}\n</div>` : fragmento;
    });
}

/**
 * Borrador del post de LinkedIn. Deliberadamente un borrador: sale a
 * review/linkedin/, que no forma parte de la web, y lo publica Sergio a mano.
 * Se descartó la publicación automática por API (token que caduca cada 60 días).
 */
function borradorLinkedIn(art, autores) {
    const url = `${SITIO}/articulos/${art.slug}.html`;
    const firmas = art.autores.map(id => autores[id]).filter(Boolean).map(a => a.nombre);
    const etiquetas = art.tags.map(t => '#' + t.normalize('NFD')
        .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
        .replace(/[^A-Za-z0-9]/g, '')).filter(t => t.length > 1);

    const gancho = art.resumen.length > 180 ? art.resumen.slice(0, 177).trim() + '…' : art.resumen;

    return `# Borrador de post — ${art.titulo}

Generado por scripts/build-articulos.js el ${hoyISO()}. Revísalo antes de publicar:
esto es un punto de partida, no un texto terminado.

---

${art.titulo}

${gancho}

${art.puntos.length ? art.puntos.map(p => `· ${p}`).join('\n') + '\n' : ''}
Lo he escrito entero aquí: ${url}

${etiquetas.slice(0, 5).join(' ')}

---

Ficha: publicado el ${fechaLarga(art.fecha)}${firmas.length > 1 ? ` · con ${firmas.slice(1).join(', ')}` : ''} · ${art.minutos} min de lectura
`;
}

// --- Programa principal ---------------------------------------------------

function main() {
    if (!fs.existsSync(DIR_ARTICULOS)) {
        console.error(`No existe ${path.relative(RAIZ, DIR_ARTICULOS)}. Nada que construir.`);
        process.exit(1);
    }

    const autores = JSON.parse(fs.readFileSync(path.join(DIR_ARTICULOS, 'autores.json'), 'utf8'));

    // README.md documenta la carpeta y los que empiezan por '_' son borradores
    // en curso: ni uno ni otros son artículos publicables.
    const ficheros = fs.readdirSync(DIR_ARTICULOS)
        .filter(f => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('_'))
        .sort();
    const articulos = [];
    const errores = [];

    for (const fichero of ficheros) {
        try {
            const bruto = fs.readFileSync(path.join(DIR_ARTICULOS, fichero), 'utf8');
            const { datos, cuerpo } = leerFrontmatter(bruto);

            for (const obligatorio of ['titulo', 'fecha', 'resumen']) {
                if (!datos[obligatorio]) throw new Error(`falta "${obligatorio}" en el frontmatter`);
            }
            if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha)) {
                throw new Error(`la fecha "${datos.fecha}" no es AAAA-MM-DD`);
            }

            const autoresArt = [].concat(datos.autores || ['sergio']);
            const desconocidos = autoresArt.filter(a => !autores[a]);
            if (desconocidos.length) {
                throw new Error(`autor(es) no declarados en autores.json: ${desconocidos.join(', ')}`);
            }

            const palabras = md.aTextoPlano(cuerpo).split(/\s+/).filter(Boolean).length;

            articulos.push({
                fichero,
                slug: datos.slug || slugificar(datos.titulo),
                titulo: datos.titulo,
                fecha: datos.fecha,
                resumen: datos.resumen,
                autores: autoresArt,
                tags: [].concat(datos.tags || []),
                imagen: datos.imagen || '',
                // Puntos sueltos para el borrador de LinkedIn, opcionales.
                puntos: [].concat(datos.puntos || []),
                // Hojas de estilo y scripts propios de este artículo, con ruta
                // relativa a la raíz del sitio. Solo se cargan donde hacen falta.
                css: [].concat(datos.css || []),
                js: [].concat(datos.js || []),
                palabras,
                minutos: Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO)),
                html: incluirFragmentos(md.render(cuerpo), fichero)
            });
        } catch (e) {
            errores.push(`${fichero}: ${e.message}`);
        }
    }

    if (errores.length) {
        console.error('\nArtículos con problemas (no se genera nada):');
        errores.forEach(e => console.error('  · ' + e));
        process.exit(1);
    }

    const slugs = articulos.map(a => a.slug);
    const repetidos = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (repetidos.length) {
        console.error(`Slugs repetidos: ${[...new Set(repetidos)].join(', ')}`);
        process.exit(1);
    }

    articulos.sort((a, b) => b.fecha.localeCompare(a.fecha));

    // Salida
    fs.mkdirSync(DIR_LINKEDIN, { recursive: true });
    for (const art of articulos) {
        fs.writeFileSync(path.join(DIR_ARTICULOS, `${art.slug}.html`), paginaArticulo(art, autores), 'utf8');
        fs.writeFileSync(path.join(DIR_LINKEDIN, `${art.slug}.md`), borradorLinkedIn(art, autores), 'utf8');
    }
    fs.writeFileSync(path.join(DIR_ARTICULOS, 'index.html'), paginaIndice(articulos, autores), 'utf8');

    // Barrido de huérfanos: si se borra o se renombra un .md, su .html se
    // quedaría publicado y enlazado desde el feed antiguo. Se elimina aquí.
    const vigentes = new Set([...articulos.map(a => `${a.slug}.html`), 'index.html']);
    const huerfanos = fs.readdirSync(DIR_ARTICULOS)
        .filter(f => f.endsWith('.html') && !vigentes.has(f));
    huerfanos.forEach(f => {
        fs.unlinkSync(path.join(DIR_ARTICULOS, f));
        console.log(`  retirado ${f} (ya no tiene .md)`);
    });
    fs.writeFileSync(path.join(RAIZ, 'feed.xml'), feedRSS(articulos, autores), 'utf8');
    actualizarSitemap(articulos);
    actualizarPortada(articulos);

    console.log(`${articulos.length} artículo(s) generados:`);
    articulos.forEach(a => console.log(`  · ${a.slug}.html — ${a.palabras} palabras, ${a.minutos} min`));
    console.log(`  índice, feed.xml, entradas de sitemap.xml y ${articulos.length} borrador(es) en review/linkedin/`);
}

main();
