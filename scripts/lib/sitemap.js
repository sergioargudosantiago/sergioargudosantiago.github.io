'use strict';

/**
 * Bloques de sitemap.xml que escriben los generadores (esquemas, fichas). Cada
 * bloque va entre marcas `<!-- nombre:inicio -->` / `<!-- nombre:fin -->`, como el
 * de artículos de scripts/build-articulos.js, y se sustituye entero en cada
 * ejecución; el resto del sitemap se edita a mano.
 *
 * El dominio vive aquí y en las páginas que generan esos scripts: tras cambiarlo
 * con scripts/cambiar-dominio.js hay que volver a generar esquemas y fichas.
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..', '..');
const SITIO = 'https://sergioargudo.es';

// entradas: [{ ruta: 'public/temas/ejercicio-1/tema-01.html', lastmod: '2026-10-11' }]
function actualizarBloque(nombre, entradas, { changefreq = 'monthly', priority = '0.6' } = {}) {
    const ruta = path.join(RAIZ, 'sitemap.xml');
    let xml = fs.readFileSync(ruta, 'utf8');
    const inicio = `  <!-- ${nombre}:inicio -->`;
    const fin = `  <!-- ${nombre}:fin -->`;
    const urls = entradas.map(e => `  <url>
    <loc>${SITIO}/${e.ruta}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');
    const bloque = `${inicio}\n${urls}\n${fin}`;
    if (xml.includes(inicio) && xml.includes(fin)) {
        xml = xml.replace(new RegExp(`${inicio}[\\s\\S]*?${fin}`), () => bloque);
    } else {
        xml = xml.replace('</urlset>', `${bloque}\n</urlset>`);
    }
    fs.writeFileSync(ruta, xml, 'utf8');
}

module.exports = { SITIO, actualizarBloque };
