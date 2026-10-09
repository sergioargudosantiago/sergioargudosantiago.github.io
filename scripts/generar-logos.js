#!/usr/bin/env node
'use strict';

/**
 * Escribe los SVG de la marca con el símbolo «S de intercambio»:
 *   logos/SAS-{icono,horizontal,vertical}-{claro,oscuro,negro,amarillo}.svg
 *   images/linkedin-banner.svg
 *
 *   npm run marca        (después: npm run marca:png para PNG, ICO e imágenes de redes)
 *
 * La geometría y los colores están en scripts/lib/simbolo.js.
 */

const fs = require('fs');
const path = require('path');
const { VARIANTES, simboloG } = require('./lib/simbolo');

const RAIZ = path.resolve(__dirname, '..');
const MEDIDAS = { icono: [160, 160], horizontal: [500, 120], vertical: [320, 210] };

function abrir(w, h, fondo) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n` +
        `  <rect width="${w}" height="${h}" fill="${fondo}"></rect>\n`;
}

function logoIcono(v) {
    const c = VARIANTES[v];
    return abrir(160, 160, c.fondo) +
        `  ${simboloG(v, 34, 14, 92)}\n` +
        `  <text x="80" y="140" class="orb" font-size="28" letter-spacing="5" text-anchor="middle" fill="${c.salida}">SAS</text>\n` +
        `</svg>\n`;
}

function logoHorizontal(v) {
    const c = VARIANTES[v];
    return abrir(500, 120, c.fondo) +
        `  ${simboloG(v, 64, 16, 88)}\n` +
        `  <rect x="200" y="28" width="2" height="64" fill="${c.salida}" opacity="0.2"></rect>\n` +
        `  <text x="220" y="64" class="orb" font-size="36" letter-spacing="6" fill="${c.salida}">SAS</text>\n` +
        `  <text x="220" y="90" class="mono" font-size="17" letter-spacing="2" fill="${c.salida}" opacity="0.6">INSPECTOR DEL SOIVRE</text>\n` +
        `</svg>\n`;
}

function logoVertical(v) {
    const c = VARIANTES[v];
    return abrir(320, 210, c.fondo) +
        `  ${simboloG(v, 122, 18, 76)}\n` +
        `  <text x="160" y="140" class="orb" font-size="38" letter-spacing="7" text-anchor="middle" fill="${c.salida}">SAS</text>\n` +
        `  <text x="160" y="168" class="mono" font-size="17" letter-spacing="3" text-anchor="middle" fill="${c.salida}" opacity="0.65">INSPECTOR DEL SOIVRE</text>\n` +
        `</svg>\n`;
}

function banner() {
    const c = VARIANTES.color;
    return abrir(1584, 396, c.fondo) +
        `  <text x="460" y="138" font-family="'IBM Plex Mono', ui-monospace, monospace" font-size="22" letter-spacing="3" fill="${c.salida}">SERGIOARGUDO.ES</text>\n` +
        `  <text x="460" y="206" font-family="Newsreader, Georgia, serif" font-weight="600" font-size="54" fill="#FFFFFF">Comercio exterior de España,</text>\n` +
        `  <text x="460" y="268" font-family="Newsreader, Georgia, serif" font-weight="600" font-size="54" fill="#FFFFFF">explicado con datos oficiales</text>\n` +
        `  <text x="460" y="324" font-family="'Public Sans', 'Segoe UI', sans-serif" font-size="22" fill="${c.entrada}">Sergio Argudo Santiago · Inspector del SOIVRE</text>\n` +
        `  ${simboloG('color', 1258, 83, 230)}\n` +
        `</svg>\n`;
}

function escribir(rel, contenido) {
    fs.writeFileSync(path.join(RAIZ, rel), contenido);
    console.log(`  · ${rel}`);
}

if (require.main === module) {
    for (const v of ['claro', 'oscuro', 'negro', 'amarillo']) {
        escribir(`logos/SAS-icono-${v}.svg`, logoIcono(v));
        escribir(`logos/SAS-horizontal-${v}.svg`, logoHorizontal(v));
        escribir(`logos/SAS-vertical-${v}.svg`, logoVertical(v));
    }
    escribir('images/linkedin-banner.svg', banner());
    console.log('13 SVG escritos. Siguiente: npm run marca:png');
}

module.exports = { logoIcono, logoHorizontal, logoVertical, banner, MEDIDAS };
