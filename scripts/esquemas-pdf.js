#!/usr/bin/env node
'use strict';

/**
 * Convierte los esquemas HTML (ejercicio-N/tema-NN.html) en PDF A4, al lado de
 * cada HTML (tema-NN.pdf). Por defecto trabaja en review/esquemas/ (vista
 * previa); con --publicar, en public/temas/. Ver scripts/generar-esquemas.js.
 *
 *   npm run esquemas:pdf                       todos
 *   npm run esquemas:pdf -- 1/6                solo el tema 6 del ejercicio 1
 *   npm run esquemas:pdf -- --publicar
 *
 * Necesita Playwright con Chromium. Si no está en el proyecto:
 *   npm install --no-save playwright && npx playwright install chromium
 * Las fuentes son las de la propia web (fonts/), no hace falta conexión.
 */

const fs = require('fs');
const path = require('path');

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) {
    console.error('Falta Playwright. Instálalo con:\n  npm install --no-save playwright && npx playwright install chromium');
    process.exit(1);
}

const RAIZ = path.resolve(__dirname, '..');
const DIR = process.argv.includes('--publicar') ? path.join(RAIZ, 'public', 'temas') : path.join(RAIZ, 'review', 'esquemas');
const filtro = (process.argv.find(a => /^\d\/\d+$/.test(a)) || '').match(/^(\d)\/(\d+)$/);

(async () => {
    const esquemas = [];
    for (const ej of fs.readdirSync(DIR).filter(d => /^ejercicio-\d$/.test(d)).sort()) {
        for (const f of fs.readdirSync(path.join(DIR, ej)).filter(x => /^tema-\d+\.html$/.test(x)).sort()) {
            if (filtro && (ej !== `ejercicio-${filtro[1]}` || Number(f.match(/\d+/)[0]) !== Number(filtro[2]))) continue;
            esquemas.push(path.join(DIR, ej, f));
        }
    }
    if (!esquemas.length) { console.error('No hay esquemas: ejecuta antes npm run esquemas'); process.exit(1); }
    // CHROMIUM permite usar un Chromium ya instalado en vez del de Playwright.
    const navegador = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
    const pagina = await navegador.newPage();
    for (const f of esquemas) {
        await pagina.goto('file://' + f, { waitUntil: 'networkidle' });
        await pagina.evaluate(() => document.fonts.ready);
        await pagina.pdf({ path: f.replace(/\.html$/, '.pdf'), printBackground: true, preferCSSPageSize: true });
        console.log(`  · ${path.relative(DIR, f).replace(/\.html$/, '.pdf')}`);
    }
    await navegador.close();
    console.log(`${esquemas.length} PDF en ${path.relative(RAIZ, DIR)}/.`);
})();
