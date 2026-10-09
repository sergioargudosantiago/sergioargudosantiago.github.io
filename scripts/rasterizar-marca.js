#!/usr/bin/env node
'use strict';

/**
 * PNG, ICO e imágenes para redes de la marca, desde los SVG de generar-logos.js.
 *
 *   npm run marca && npm run marca:png
 *
 * Necesita Playwright con Chromium y conexión (fuentes de Google):
 *   npm install --no-save playwright && npx playwright install chromium
 */

const fs = require('fs');
const path = require('path');
const { VARIANTES, piezas } = require('./lib/simbolo');
const { crearIco, medidasPng } = require('./lib/ico');
const { logoIcono, logoHorizontal, logoVertical, banner, MEDIDAS } = require('./generar-logos');

let chromium;
try { ({ chromium } = require('playwright')); }
catch (e) {
    console.error('Falta Playwright. Instálalo con:\n  npm install --no-save playwright && npx playwright install chromium');
    process.exit(1);
}

const RAIZ = path.resolve(__dirname, '..');
const FUENTES = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:opsz,wght@6..72,600&family=Orbitron:wght@700;800&family=Public+Sans:ital,wght@0,400;0,700;1,400&display=swap';
const COMPROBAR = ['800 20px Orbitron', '400 20px "IBM Plex Mono"', '600 20px Newsreader', '400 20px "Public Sans"'];

function documento(cuerpo) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FUENTES}">
<style>html,body{margin:0;background:transparent}.orb{font-family:Orbitron;font-weight:800}.mono{font-family:'IBM Plex Mono',monospace}</style>
</head><body>${cuerpo}</body></html>`;
}

// Encaja un SVG de w × h dentro de un lienzo W × H, centrado y sin deformar.
function encajar(svg, w, h, W, H, fondo) {
    const k = Math.min(W / w, H / h);
    const ajustado = svg.replace(`width="${w}" height="${h}"`, `width="${(w * k).toFixed(1)}" height="${(h * k).toFixed(1)}"`);
    return `<div style="width:${W}px;height:${H}px;background:${fondo};display:grid;place-items:center">${ajustado}</div>`;
}

function tesela(lado, radio) {
    const s = Math.round(lado * 0.72);
    return `<div style="width:${lado}px;height:${lado}px;border-radius:${radio};background:#3B4533;display:grid;place-items:center">` +
        `<svg viewBox="0 0 120 120" width="${s}" height="${s}">${piezas(VARIANTES.oscuro)}</svg></div>`;
}

function ogCover() {
    return `<div style="width:1200px;height:630px;box-sizing:border-box;padding:0 96px;background:#3B4533;color:#FFFFFF;display:flex;align-items:center;justify-content:space-between;gap:64px;font-family:'Public Sans',sans-serif">
<div style="display:flex;flex-direction:column;gap:24px;max-width:660px">
<span style="font-family:'IBM Plex Mono',monospace;font-size:24px;letter-spacing:0.08em;color:#E0C46B">SERGIOARGUDO.ES</span>
<span style="font-family:Newsreader,serif;font-weight:600;font-size:66px;line-height:1.05">Temario, esquemas y datos para opositar al SOIVRE</span>
<span style="font-size:28px;color:#C2D9C2">Sergio Argudo Santiago · Inspector del SOIVRE</span>
</div>
<svg viewBox="0 0 120 120" width="320" height="320" style="flex-shrink:0">${piezas(VARIANTES.color)}</svg>
</div>`;
}

async function capturar(pagina, cuerpo, W, H, transparente) {
    await pagina.setViewportSize({ width: W, height: H });
    await pagina.setContent(documento(cuerpo), { waitUntil: 'networkidle' });
    await pagina.evaluate(() => document.fonts.ready);
    // document.fonts.check() da true si la fuente ni siquiera está declarada, así que
    // se fuerza la carga: si Google Fonts no responde, load() devuelve una lista vacía.
    const faltan = await pagina.evaluate(async lista => {
        const r = [];
        for (const f of lista) if (!(await document.fonts.load(f)).length) r.push(f);
        return r;
    }, COMPROBAR);
    if (faltan.length) throw new Error(`No cargan las fuentes: ${faltan.join(', ')}. ¿Hay conexión?`);
    return pagina.screenshot({ clip: { x: 0, y: 0, width: W, height: H }, omitBackground: !!transparente });
}

function guardar(rel, buf) {
    const destino = path.join(RAIZ, rel);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    fs.writeFileSync(destino, buf);
    const m = buf[0] === 0x89 ? medidasPng(buf) : null;
    console.log(`  · ${rel}${m ? ` (${m.ancho} × ${m.alto})` : ''}`);
}

(async () => {
    const navegador = await chromium.launch();
    const pagina = await navegador.newPage({ deviceScaleFactor: 1 });
    try {
        const PNG = { icono: [160, 160, logoIcono], horizontal: [600, 120, logoHorizontal], vertical: [640, 400, logoVertical] };
        for (const v of ['claro', 'oscuro']) {
            for (const [f, [W, H, fn]] of Object.entries(PNG)) {
                const [w, h] = MEDIDAS[f];
                guardar(`logos/png/SAS-${f}-${v}.png`, await capturar(pagina, encajar(fn(v), w, h, W, H, VARIANTES[v].fondo), W, H));
            }
        }
        const ico = [];
        for (const lado of [16, 32, 48]) ico.push(await capturar(pagina, tesela(lado, '22%'), lado, lado, true));
        guardar('favicon.ico', crearIco(ico));
        guardar('apple-touch-icon.png', await capturar(pagina, tesela(180, '0'), 180, 180));
        guardar('images/logo.png', await capturar(pagina,
            `<div style="width:550px;height:493px;background:#3B4533;display:grid;place-items:center"><svg viewBox="0 0 120 120" width="300" height="300">${piezas(VARIANTES.color)}</svg></div>`, 550, 493));
        guardar('images/og-cover.png', await capturar(pagina, ogCover(), 1200, 630));
        guardar('review/linkedin/banner.png', await capturar(pagina, banner(), 1584, 396));
    } finally {
        await navegador.close();
    }
    console.log('Hecho. El banner para LinkedIn está en review/linkedin/banner.png (no se publica).');
})().catch(e => { console.error(e.message); process.exit(1); });
