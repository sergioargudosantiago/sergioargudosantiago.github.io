#!/usr/bin/env node
'use strict';

/**
 * Convierte las fichas de public/fichas/*.html en PDF A4 (public/fichas/pdf/).
 *
 *   npm run fichas:pdf
 *
 * Necesita Playwright con Chromium. Si no está en el proyecto:
 *   npm install --no-save playwright && npx playwright install chromium
 * Las fuentes vienen de Google Fonts, así que hace falta conexión.
 */

const fs = require('fs');
const path = require('path');

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) {
    console.error('Falta Playwright. Instálalo con:\n  npm install --no-save playwright && npx playwright install chromium');
    process.exit(1);
}

const DIR = path.resolve(__dirname, '..', 'public', 'fichas');
const SALIDA = path.join(DIR, 'pdf');

(async () => {
    const fichas = fs.readdirSync(DIR).filter(f => /^tema-\d+\.html$/.test(f)).sort();
    if (!fichas.length) { console.error('No hay fichas: ejecuta antes npm run fichas'); process.exit(1); }
    fs.mkdirSync(SALIDA, { recursive: true });
    const navegador = await chromium.launch();
    const pagina = await navegador.newPage();
    for (const f of fichas) {
        await pagina.goto('file://' + path.join(DIR, f), { waitUntil: 'networkidle' });
        await pagina.evaluate(() => document.fonts.ready);
        const destino = path.join(SALIDA, f.replace('.html', '.pdf'));
        await pagina.pdf({ path: destino, format: 'A4', printBackground: true, preferCSSPageSize: true });
        console.log(`  · pdf/${path.basename(destino)}`);
    }
    await navegador.close();
    console.log(`${fichas.length} PDF en public/fichas/pdf/.`);
})();
