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

const RAIZ = path.resolve(__dirname, '..');
const DIR_ARTICULOS = path.join(RAIZ, 'articulos');
const DIR_LINKEDIN = path.join(RAIZ, 'review', 'linkedin');

// Dominio público del sitio. Lo reescribe scripts/cambiar-dominio.js cuando
// sergioargudo.com esté activo; no editarlo a mano en dos sitios distintos.
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
function navegacion(base, activo) {
    const secciones = [
        ['index.html', 'INTRODUCCIÓN', 'inicio'],
        ['temario.html', 'TEMARIO', 'temario'],
        ['comercio-exterior.html', 'COMERCIO EXTERIOR', 'comercio'],
        ['articulos/index.html', 'ARTÍCULOS', 'articulos'],
        ['enlaces.html', 'ENLACES', 'enlaces'],
        ['sobre-mi.html', 'SOBRE MÍ', 'sobre-mi']
    ];
    const enlaces = secciones.map(([href, texto, id]) =>
        `        <a href="${base}${href}" class="nav-segment${id === activo ? ' active' : ''}">${texto}</a>`
    ).join('\n');

    const movil = secciones.map(([href, texto, id]) =>
        `                <a href="${base}${href}" onclick="toggleMobileMenu();"${id === activo ? ' class="active-mobile"' : ''}>${texto}</a>`
    ).join('\n');

    return { enlaces, movil };
}

function cabeceraHTML({ titulo, descripcion, url, imagen, base, tipo, extra }) {
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
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <meta name="author" content="Sergio Argudo Santiago">
    <meta property="og:type" content="${tipo}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${md.escapeAttr(titulo)}">
    <meta property="og:description" content="${md.escapeAttr(descripcion)}">
    <meta property="og:image" content="${imagen}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="${md.escapeAttr(titulo)}">
    <meta property="twitter:description" content="${md.escapeAttr(descripcion)}">
    <meta property="twitter:image" content="${imagen}">
${extra || ''}
    <link rel="stylesheet" href="${base}css/tailwind.css">
    <style>
${estilos()}
    </style>
</head>`;
}

function estilos() {
    return `:root { --background:#C2D9C2; --foreground:#3B4533; --primary:#3B4533; --border:#3B4533; --radius:6px; --accent-warm:#C8A951; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Inter','Segoe UI',system-ui,sans-serif; background:#C2D9C2; color:#3B4533; min-height:100vh; padding-bottom:5rem; line-height:1.55; -webkit-font-smoothing:antialiased; }
h1,h2,h3,h4 { font-family:'Orbitron',monospace; letter-spacing:0.03em; }
[data-reveal] { opacity:0; transform:translateY(24px); transition:opacity 0.7s,transform 0.7s; }
[data-reveal].revealed { opacity:1; transform:translateY(0); }
.mobile-breadcrumb { position:fixed; top:0; left:0; right:0; z-index:40; display:flex; align-items:center; padding:0.5rem 1rem; background:#3B4533; border-bottom:1px solid rgba(194,217,194,0.3); font-family:'Orbitron',monospace; font-size:0.6rem; font-weight:700; letter-spacing:0.08em; color:#C2D9C2; text-transform:uppercase; height:2.5rem; }
@media(min-width:768px){.mobile-breadcrumb{display:none}}
#mobileMenu { transform:translateX(-100%); opacity:0; visibility:hidden; transition:transform 0.2s ease,opacity 0.2s ease,visibility 0s 0.2s; background:#3B4533!important; border-right:2px solid rgba(194,217,194,0.3); }
#mobileMenu.menu-open { transform:translateX(0); opacity:1; visibility:visible; transition:transform 0.2s ease,opacity 0.2s ease; z-index:60; }
#mobileMenu a { font-family:'Orbitron',monospace; font-size:0.65rem; font-weight:600; color:#C2D9C2; letter-spacing:0.05em; padding:0.75rem 1rem; border-bottom:1px solid rgba(194,217,194,0.15); display:flex; align-items:center; min-height:44px; text-decoration:none; }
#mobileMenu a:hover,#mobileMenu a.active-mobile { background:#C2D9C2!important; color:#3B4533!important; }
.nav-island { position:fixed; top:1rem; left:50%; transform:translateX(-50%); transform-origin:top center; z-index:50; display:flex; align-items:stretch; padding:0 clamp(0.1rem,0.2vw,0.25rem); background:#C2D9C2; border:2px solid #3B4533; box-shadow:4px 4px 0 #3B4533; height:clamp(2.4rem,1.4rem + 2vw,4.25rem); width:max-content; max-width:calc(100vw - 1.5rem); white-space:nowrap; overflow:hidden; }
.nav-logo-link { display:flex; align-items:center; padding:0 clamp(0.4rem,0.3rem + 0.7vw,1rem); height:100%; border-right:1px solid rgba(59,69,51,0.2); flex-shrink:0; }
.nav-segment { position:relative; padding:0 clamp(0.25rem,0.15rem + 0.75vw,1.25rem); height:100%; display:flex; align-items:center; font-family:'Orbitron',monospace; font-size:clamp(0.58rem,0.3rem + 0.38vw,0.75rem); font-weight:600; color:#3B4533; text-decoration:none; border-right:1px solid rgba(59,69,51,0.2); letter-spacing:0.03em; white-space:nowrap; transition:background 0.15s,color 0.15s; flex-shrink:1; min-width:0; overflow:hidden; text-overflow:ellipsis; }
.nav-island img { width:clamp(56px,30px + 6.5vw,200px); height:auto; }
.nav-segment:hover { background:#3B4533; color:#C2D9C2; }
.nav-segment.active { background:#3B4533; color:#C2D9C2; font-weight:700; }
@media (max-width:768px) { .nav-island { display:none; } }
.theme-toggle { display:flex; align-items:center; justify-content:center; width:clamp(2.25rem,3.5vw,4rem); height:100%; background:transparent; border:none; border-left:1px solid rgba(59,69,51,0.2); cursor:pointer; color:#3B4533; padding:0; flex-shrink:0; transition:background 0.15s,color 0.15s; }
.theme-toggle:hover { background:#3B4533; color:#C2D9C2; }
.arcade-section-title { font-family:'Orbitron',monospace; font-size:0.72rem; font-weight:700; letter-spacing:0.1em; color:#3B4533; text-transform:uppercase; border-bottom:2px solid #3B4533; padding-bottom:0.5rem; margin-bottom:1.25rem; }
.arcade-grid-card { background:#C2D9C2; border:2px solid #3B4533; padding:1.75rem; box-shadow:4px 4px 0 #3B4533; border-radius:6px; display:flex; flex-direction:column; height:100%; }
footer.arcade-footer { background:#3B4533!important; color:#C2D9C2!important; border-top:2px solid #3B4533!important; }
footer.arcade-footer a { color:#C2D9C2; transition:color 0.15s; }
footer.arcade-footer a:hover { color:#FFE566; }
html.dark body { background:#3B4533; color:#C2D9C2; }
html.dark .arcade-grid-card { background:#2D3828; border-color:#C2D9C2; box-shadow:4px 4px 0 rgba(194,217,194,0.3); }
html.dark .arcade-section-title { color:#C2D9C2; border-bottom-color:rgba(194,217,194,0.5); }
html.dark .nav-island { background:#3B4533; border-color:#C2D9C2; box-shadow:4px 4px 0 rgba(194,217,194,0.3); }
html.dark .nav-segment { color:#C2D9C2; border-right-color:rgba(194,217,194,0.2); }
html.dark .nav-segment:hover { background:#C2D9C2; color:#3B4533; }
html.dark .nav-segment.active { background:#C2D9C2; color:#3B4533; }
html.dark .theme-toggle { color:#C2D9C2; border-left-color:rgba(194,217,194,0.2); }
html.dark .theme-toggle:hover { background:#C2D9C2; color:#3B4533; }
html.dark footer.arcade-footer { background:#C2D9C2!important; color:#3B4533!important; border-color:#C2D9C2!important; }
html.dark footer.arcade-footer a { color:#3B4533; }
html.dark #mobileMenu { background:#2D3828!important; border-right-color:rgba(194,217,194,0.2); }
html.dark #mobileMenu a:hover,html.dark #mobileMenu a.active-mobile { background:#C2D9C2!important; color:#3B4533!important; }
html.dark .mobile-breadcrumb { background:#2D3828; border-bottom-color:rgba(194,217,194,0.2); }
html.dark .nav-logo-light { display:none !important; }
html.dark .nav-logo-dark { display:block !important; }
.nav-logo-light { display:block; }
.nav-logo-dark { display:none; }

/* ========== ARTÍCULOS ========== */
.art-meta { font-family:'Share Tech Mono',monospace; font-size:0.8rem; opacity:0.85; display:flex; flex-wrap:wrap; gap:0.5rem 1rem; align-items:center; }
.art-etiqueta { font-family:'Share Tech Mono',monospace; font-size:0.7rem; text-transform:uppercase; letter-spacing:0.06em; border:1px solid currentColor; padding:0.1rem 0.5rem; border-radius:999px; opacity:0.9; }
.art-cuerpo { font-size:1.02rem; line-height:1.75; }
.art-cuerpo > * + * { margin-top:1.1rem; }
.art-cuerpo h2 { font-size:1.15rem; text-transform:uppercase; letter-spacing:0.08em; border-bottom:2px solid currentColor; padding-bottom:0.4rem; margin-top:2.4rem; }
.art-cuerpo h3 { font-size:0.98rem; text-transform:uppercase; letter-spacing:0.06em; margin-top:1.8rem; }
.art-cuerpo h4 { font-size:0.9rem; margin-top:1.4rem; }
.art-cuerpo a { color:inherit; text-decoration:underline; text-underline-offset:2px; font-weight:500; }
.art-cuerpo a:hover { color:var(--accent-warm); }
.art-cuerpo ul,.art-cuerpo ol { padding-left:1.4rem; display:flex; flex-direction:column; gap:0.4rem; }
.art-cuerpo li { padding-left:0.2rem; }
.art-cuerpo blockquote { border-left:4px solid var(--accent-warm); background:rgba(200,169,81,0.10); padding:0.9rem 1.1rem; border-radius:4px; font-style:italic; }
.art-cuerpo blockquote > * + * { margin-top:0.8rem; }
.art-cuerpo code { font-family:'Share Tech Mono',monospace; font-size:0.9em; background:rgba(59,69,51,0.10); padding:0.1rem 0.35rem; border-radius:3px; }
.art-cuerpo pre { background:rgba(59,69,51,0.10); border:1px solid rgba(59,69,51,0.25); border-radius:4px; padding:0.9rem 1.1rem; overflow-x:auto; }
.art-cuerpo pre code { background:none; padding:0; font-size:0.85rem; line-height:1.6; }
.art-cuerpo img { max-width:100%; height:auto; border:2px solid currentColor; border-radius:4px; }
.art-cuerpo hr { border:none; border-top:2px solid currentColor; opacity:0.3; margin:2rem 0; }
.art-tabla-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
.art-tabla { width:100%; border-collapse:collapse; font-size:0.9rem; min-width:420px; }
.art-tabla th,.art-tabla td { text-align:left; padding:0.55rem 0.7rem; border-bottom:1px solid rgba(59,69,51,0.18); }
.art-tabla th { font-family:'Orbitron',monospace; font-size:0.68rem; text-transform:uppercase; letter-spacing:0.07em; border-bottom:2px solid currentColor; }
html.dark .art-cuerpo code,html.dark .art-cuerpo pre { background:rgba(194,217,194,0.10); border-color:rgba(194,217,194,0.25); }
html.dark .art-tabla th,html.dark .art-tabla td { border-bottom-color:rgba(194,217,194,0.2); }
.art-compartir { display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center; }
.art-btn { display:inline-flex; align-items:center; gap:0.4rem; font-family:'Share Tech Mono',monospace; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.04em; padding:0.45rem 0.9rem; border:1px solid currentColor; background:transparent; color:inherit; cursor:pointer; text-decoration:none; transition:background 0.2s,color 0.2s; }
.art-btn:hover,.art-btn:focus-visible { background:#3B4533; color:#C2D9C2; }
html.dark .art-btn:hover,html.dark .art-btn:focus-visible { background:#C2D9C2; color:#3B4533; }
.art-tarjeta { display:flex; flex-direction:column; gap:0.6rem; text-decoration:none; color:inherit; }
.art-tarjeta:hover .art-tarjeta-titulo { color:var(--accent-warm); }
.art-tarjeta-titulo { font-family:'Orbitron',monospace; font-size:1.05rem; font-weight:700; letter-spacing:0.02em; line-height:1.35; transition:color 0.15s; }`;
}

function cuerpoComun({ base, activo, migaTitulo }) {
    const nav = navegacion(base, activo);
    return {
        cabeceraMovil: `    <div class="mobile-breadcrumb md:hidden" style="justify-content:space-between;">
        <div style="display:flex;align-items:center;">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            &nbsp;${md.escapeHTML(migaTitulo)}
        </div>
        <button onclick="toggleTheme()" aria-label="Cambiar tema"
            style="display:flex;align-items:center;justify-content:center;width:2.5rem;height:2.5rem;background:transparent;border:none;border-left:1px solid rgba(194,217,194,0.3);cursor:pointer;color:#C2D9C2;margin-right:2.5rem;flex-shrink:0;">
            <svg class="theme-icon-sun" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="5" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg class="theme-icon-moon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="display:none"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        </button>
    </div>
    <nav class="nav-island hidden md:flex">
        <a href="${base}index.html" class="nav-logo-link">
            <img class="nav-logo-light" src="${base}logos/png/SAS-horizontal-claro.png" alt="Sergio Argudo Santiago" width="260" height="62">
            <img class="nav-logo-dark" src="${base}logos/png/SAS-horizontal-oscuro.png" alt="Sergio Argudo Santiago" width="260" height="62">
        </a>
${nav.enlaces}
        <button onclick="toggleTheme()" class="theme-toggle" aria-label="Cambiar tema">
            <svg class="theme-icon-sun" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="5" stroke-width="2"/><path stroke-linecap="round" stroke-width="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            <svg class="theme-icon-moon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="display:none"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        </button>
    </nav>
    <button class="md:hidden fixed top-0 right-0 z-50 flex items-center justify-center" style="width:2.5rem;height:2.5rem;background:#3B4533;border-left:1px solid rgba(194,217,194,0.3);border-bottom:1px solid rgba(194,217,194,0.3);" onclick="toggleMobileMenu()" aria-label="Abrir menú">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#C2D9C2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
    <div id="mobileMenu" class="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
        <div class="flex h-full flex-col">
            <div style="border-bottom:1px solid rgba(194,217,194,0.3);padding:0.75rem 1rem">
                <button onclick="toggleMobileMenu()" class="text-left text-lg font-bold" style="color:#C2D9C2">Menú</button>
            </div>
            <nav class="flex flex-col p-2">
${nav.movil}
            </nav>
        </div>
    </div>`,
        pie: `    <footer class="arcade-footer fixed bottom-0 left-0 right-0 z-50 border-t">
        <div class="container mx-auto flex h-12 items-center justify-center gap-6 px-4">
            <a href="https://www.linkedin.com/in/sergio-argudo-santiago/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            <a href="mailto:contacto@sergioargudo.com" aria-label="Email" target="_blank" rel="noopener noreferrer"><svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></a>
            <a href="https://github.com/sergio-argudo" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
        </div>
    </footer>

    <script src="${base}js/main.js" onerror="console.warn('main.js not found')"></script>
    <script>
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (!menu) return;
    menu.classList.toggle('menu-open');
    if (menu.classList.contains('menu-open')) { document.body.style.overflow='hidden'; document.body.style.position='fixed'; document.body.style.width='100%'; }
    else { document.body.style.overflow=''; document.body.style.position=''; document.body.style.width=''; }
}
document.addEventListener('keydown', function(e) { if (e.key==='Escape') { const m=document.getElementById('mobileMenu'); if (m&&m.classList.contains('menu-open')) toggleMobileMenu(); } });
    </script>
    <script src="${base}js/cookies.js?v=1"></script>
</body>

</html>`
    };
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

    const partes = cuerpoComun({ base: '../', activo: 'articulos', migaTitulo: 'Artículos' });

    const cabecera = cabeceraHTML({
        titulo: `${art.titulo} — Sergio Argudo Santiago`,
        descripcion: art.resumen,
        url, imagen, base: '../', tipo: 'article',
        extra: `    <meta property="article:published_time" content="${art.fecha}">
${art.tags.map(t => `    <meta property="article:tag" content="${md.escapeAttr(t)}">`).join('\n')}
    <script type="application/ld+json">${JSON.stringify(jsonLD)}</script>`
    });

    const bloqueFirmas = firmas.map(a => {
        const nombre = md.escapeHTML(a.nombre);
        const enlace = a.url
            ? `<a href="${md.escapeAttr(a.url)}" target="_blank" rel="noopener noreferrer">${nombre}</a>`
            : nombre;
        return `<span>${enlace}${a.cargo ? ` &middot; <span style="opacity:0.75">${md.escapeHTML(a.cargo)}</span>` : ''}</span>`;
    }).join('<span aria-hidden="true">|</span>');

    return `${cabecera}

<body class="flex min-h-screen flex-col">

${partes.cabeceraMovil}

    <main class="relative flex-1 pb-24 pt-8">
        <section class="w-full py-20 md:py-28">
            <div class="container mx-auto max-w-3xl px-4 md:px-6">

                <a href="index.html" class="art-btn mb-8" style="border:none;padding-left:0">&larr; Todos los artículos</a>

                <article class="arcade-grid-card" data-reveal>
                    <header style="margin-bottom:2rem">
                        <h1 style="font-family:'Orbitron',monospace;font-weight:800;letter-spacing:0.03em;font-size:clamp(1.5rem,1rem + 2vw,2.4rem);line-height:1.2;text-transform:uppercase;margin-bottom:1rem">${md.escapeHTML(art.titulo)}</h1>
                        <p style="font-family:'Share Tech Mono',monospace;opacity:0.9;margin-bottom:1rem">${md.escapeHTML(art.resumen)}</p>
                        <div class="art-meta">
                            <time datetime="${art.fecha}">${fechaLarga(art.fecha)}</time>
                            <span aria-hidden="true">|</span>
                            <span>${art.minutos} min de lectura</span>
                            ${firmas.length ? `<span aria-hidden="true">|</span>${bloqueFirmas}` : ''}
                        </div>
                        ${art.tags.length ? `<div class="art-meta" style="margin-top:0.75rem">${art.tags.map(t => `<span class="art-etiqueta">${md.escapeHTML(t)}</span>`).join('')}</div>` : ''}
                    </header>

                    <div class="art-cuerpo">
${art.html}
                    </div>

                    <footer style="margin-top:2.5rem;padding-top:1.5rem;border-top:2px solid currentColor">
                        <p class="arcade-section-title" style="border-bottom:none;margin-bottom:0.75rem">Compartir</p>
                        <div class="art-compartir">
                            <a class="art-btn" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            <button type="button" class="art-btn" id="btnCopiarEnlace" data-url="${url}">Copiar enlace</button>
                            <a class="art-btn" href="../feed.xml">RSS</a>
                        </div>
                    </footer>
                </article>

            </div>
        </section>
    </main>

${partes.pie.replace('</body>', `    <script>
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
    const partes = cuerpoComun({ base: '../', activo: 'articulos', migaTitulo: 'Artículos' });
    const cabecera = cabeceraHTML({
        titulo: 'Artículos — Sergio Argudo Santiago',
        descripcion: 'Artículos sobre comercio exterior, política comercial y la preparación de la oposición al SOIVRE.',
        url, imagen: `${SITIO}/images/og-cover.png`, base: '../', tipo: 'website'
    });

    const tarjetas = articulos.map(art => {
        const firmas = art.autores.map(id => autores[id]).filter(Boolean)
            .map(a => md.escapeHTML(a.nombre)).join(', ');
        return `                    <div class="arcade-grid-card" data-reveal>
                        <a href="${art.slug}.html" class="art-tarjeta">
                            <div class="art-meta">
                                <time datetime="${art.fecha}">${fechaLarga(art.fecha)}</time>
                                <span aria-hidden="true">|</span>
                                <span>${art.minutos} min</span>
                                ${firmas ? `<span aria-hidden="true">|</span><span>${firmas}</span>` : ''}
                            </div>
                            <h2 class="art-tarjeta-titulo">${md.escapeHTML(art.titulo)}</h2>
                            <p style="opacity:0.9">${md.escapeHTML(art.resumen)}</p>
                            ${art.tags.length ? `<div class="art-meta" style="margin-top:0.25rem">${art.tags.map(t => `<span class="art-etiqueta">${md.escapeHTML(t)}</span>`).join('')}</div>` : ''}
                        </a>
                    </div>`;
    }).join('\n');

    const vacio = `                    <div class="arcade-grid-card" data-reveal>
                        <p>Todavía no hay ningún artículo publicado.</p>
                    </div>`;

    return `${cabecera}

<body class="flex min-h-screen flex-col">

${partes.cabeceraMovil}

    <main class="relative flex-1 pb-24 pt-8">
        <section class="w-full py-20 md:py-28">
            <div class="container mx-auto max-w-3xl px-4 md:px-6">

                <div class="mb-12 text-center" data-reveal>
                    <h1 style="font-family:'Orbitron',monospace;font-weight:800;letter-spacing:0.04em;font-size:clamp(2rem,1.5rem + 2vw,3.5rem);text-transform:uppercase;margin-bottom:1rem">ARTÍCULOS</h1>
                    <p style="font-family:'Share Tech Mono',monospace;max-width:660px;margin:0 auto">Comercio exterior, política comercial y preparación de la oposición. Con fuentes y datos que puedes comprobar.</p>
                    <p style="margin-top:1rem"><a class="art-btn" href="../feed.xml">Suscribirse por RSS</a></p>
                </div>

                <div style="display:flex;flex-direction:column;gap:1.5rem">
${articulos.length ? tarjetas : vacio}
                </div>

            </div>
        </section>
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
                palabras,
                minutos: Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO)),
                html: md.render(cuerpo)
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
    fs.writeFileSync(path.join(RAIZ, 'feed.xml'), feedRSS(articulos, autores), 'utf8');
    actualizarSitemap(articulos);

    console.log(`${articulos.length} artículo(s) generados:`);
    articulos.forEach(a => console.log(`  · ${a.slug}.html — ${a.palabras} palabras, ${a.minutos} min`));
    console.log(`  índice, feed.xml, entradas de sitemap.xml y ${articulos.length} borrador(es) en review/linkedin/`);
}

main();
